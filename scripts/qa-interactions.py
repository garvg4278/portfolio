"""Drives the built site in headless Chromium and checks every interactive feature.
Run after `npm run build`:  python3 scripts/qa-interactions.py   (exit code 1 on any failure)"""
import asyncio, functools, http.server, json, pathlib, socketserver, sys, threading
from playwright.async_api import async_playwright

DIST = pathlib.Path(__file__).resolve().parent.parent / 'dist'
PORT = 4396
BASE = f'http://127.0.0.1:{PORT}'
FLAGS = ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader']
results = []

def check(name, ok, detail=''):
    results.append((name, bool(ok)))
    print(('ok   ' if ok else 'FAIL ') + name + (f'  [{detail}]' if detail and not ok else ''))

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

async def main():
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), functools.partial(Quiet, directory=str(DIST)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    async with async_playwright() as p:
        b = await p.chromium.launch(args=FLAGS)
        ctx = await b.new_context(viewport={'width': 1440, 'height': 900}, permissions=['clipboard-read', 'clipboard-write'])
        pg = await ctx.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)

        # --- hero layers + 3D (forced, since this sandbox has no GPU)
        await pg.goto(BASE + '/?scene=force'); await pg.wait_for_timeout(2500)
        await pg.click('.layers__list button[data-i="2"]')
        check('hero: layer button selects and shows text', await pg.get_attribute('.layers__list button[data-i="2"]', 'aria-pressed') == 'true' and 'CI/CD' in await pg.inner_text('.layers__out'))
        box = await pg.locator('.hero__scene canvas').bounding_box()
        await pg.mouse.click(box['x'] + box['width'] * 0.64, box['y'] + box['height'] * 0.66); await pg.wait_for_timeout(400)
        check('hero: clicking a slab in the 3D scene selects a layer', await pg.get_attribute('.layers__list button[data-i="1"]', 'aria-pressed') == 'true')

        # --- skip link is the first tab stop
        await pg.goto(BASE + '/'); await pg.keyboard.press('Tab')
        check('skip to content is the first focus stop', await pg.evaluate("document.activeElement.className") == 'skip')
        await pg.keyboard.press('Enter'); await pg.wait_for_timeout(100)
        check('skip link moves focus to main', await pg.evaluate("document.activeElement.id") == 'main')

        # --- theme toggle: switches, persists across reload, labels change
        check('theme: dark by default', await pg.evaluate("document.documentElement.dataset.theme") == 'dark')
        await pg.click('[data-theme-toggle]')
        check('theme: toggle switches to light', await pg.evaluate("document.documentElement.dataset.theme") == 'light')
        check('theme: label names the next action', 'dark' in (await pg.get_attribute('[data-theme-toggle]', 'aria-label')))
        check('theme: choice saved', await pg.evaluate("localStorage.getItem('theme')") == 'light')
        await pg.reload(); await pg.wait_for_timeout(300)
        check('theme: survives a reload with no flash (set before paint)', await pg.evaluate("document.documentElement.dataset.theme") == 'light')
        bg_light = await pg.evaluate("getComputedStyle(document.body).backgroundColor")
        await pg.click('[data-theme-toggle]')
        bg_dark = await pg.evaluate("getComputedStyle(document.body).backgroundColor")
        check('theme: page colours actually change', bg_light != bg_dark, f'{bg_light} vs {bg_dark}')

        # --- progress bar, back to top, sticky header
        await pg.goto(BASE + '/projects/'); await pg.wait_for_timeout(500)
        check('back to top: hidden at the top', await pg.is_hidden('[data-totop]'))
        await pg.evaluate("window.scrollTo(0, 1800)"); await pg.wait_for_timeout(400)
        prog = float(await pg.evaluate("getComputedStyle(document.querySelector('[data-progress]')).getPropertyValue('--p')") or 0)
        check('progress bar: grows while scrolling', prog > 0.05, str(prog))
        check('back to top: appears after scrolling', await pg.is_visible('[data-totop]'))
        nav_top = await pg.evaluate("document.querySelector('.nav').getBoundingClientRect().top")
        check('sticky header: stays at the top of the viewport', nav_top == 0, str(nav_top))
        await pg.click('[data-totop]'); await pg.wait_for_timeout(900)
        check('back to top: returns to the top', await pg.evaluate("window.scrollY") < 5)

        # --- hover states change real styles
        await pg.hover('.nav__links ul a:not([aria-current])'); await pg.wait_for_timeout(300)
        link_color = await pg.evaluate("getComputedStyle(document.querySelector('.nav__links ul a:not([aria-current])')).color")
        await pg.hover('.btn >> nth=0'); await pg.wait_for_timeout(400)
        btn_transform = await pg.evaluate("getComputedStyle(document.querySelector('.btn')).transform")
        check('hover: nav link and button respond', link_color and btn_transform != 'none', btn_transform)

        # --- copy buttons
        await pg.goto(BASE + '/contact/'); await pg.wait_for_timeout(500)
        await pg.click('.methods [data-copy-text]'); await pg.wait_for_timeout(300)
        clip = await pg.evaluate("navigator.clipboard.readText()")
        check('copy: email copied to the clipboard', clip == 'garvg4278@gmail.com', clip)
        check('copy: button says Copied', 'Copied' in await pg.inner_text('.methods [data-copy-text]'))
        check('copy: announced to screen readers', 'Copied' in await pg.inner_text('#live-status'))
        await pg.goto(BASE + '/projects/containerized-portfolio/'); await pg.wait_for_timeout(400)
        await pg.click('.snip [data-copy-text]'); await pg.wait_for_timeout(300)
        check('copy: code snippet copied', 'docker run' in await pg.evaluate("navigator.clipboard.readText()"))

        # --- contact form: errors, busy state, mailto, clear with confirmation
        await pg.goto(BASE + '/contact/'); await pg.wait_for_timeout(500)
        await pg.click('form.cf button[type=submit]')
        check('form error state: inline errors and a summary', await pg.locator('.err:not([hidden])').count() == 4 and 'attention' in await pg.inner_text('.cf__summary'))
        await pg.fill('#cf-name', 'Test'); await pg.fill('#cf-email', 'a@b.co'); await pg.fill('#cf-subject', 'Hello'); await pg.fill('#cf-message', 'A message that is long enough to pass.')
        await pg.route('mailto:**', lambda r: r.abort())
        await pg.click('form.cf button[type=submit]'); await pg.wait_for_timeout(400)
        check('form: no fake success without a backend', 'Nothing has been sent yet' in await pg.inner_text('[data-status]'))
        # clear with confirmation: cancel keeps, confirm clears
        await pg.click('[data-clear]'); await pg.wait_for_timeout(300)
        check('confirm modal: opens for destructive action', await pg.evaluate("document.getElementById('confirm-dialog').open"))
        await pg.click('#confirm-dialog [data-cancel]'); await pg.wait_for_timeout(300)
        check('confirm modal: cancel keeps the text', await pg.input_value('#cf-name') == 'Test')
        await pg.click('[data-clear]'); await pg.wait_for_timeout(300)
        await pg.click('#confirm-dialog [data-confirm]'); await pg.wait_for_timeout(300)
        check('confirm modal: confirm clears the form', await pg.input_value('#cf-name') == '' and await pg.input_value('#cf-message') == '')
        await pg.click('[data-clear]'); await pg.wait_for_timeout(200)
        check('confirm modal: not shown when there is nothing to lose', not await pg.evaluate("document.getElementById('confirm-dialog').open"))

        # --- success, error and loading states through a stubbed form service (endpoint is a build-time setting,
        #     so the page is served with data-endpoint filled in, exactly as a build with PUBLIC_FORM_ENDPOINT would)
        async def with_endpoint(url):
            page = await ctx.new_page()
            async def serve(route):
                resp = await route.fetch()
                body = (await resp.text()).replace(' data-endpoint ', f' data-endpoint="{url}" ')
                await route.fulfill(response=resp, body=body)
            await page.route('**/contact/', serve)
            await page.goto(BASE + '/contact/'); await page.wait_for_timeout(500)
            return page
        async def fill(page):
            await page.fill('#cf-name', 'Test'); await page.fill('#cf-email', 'a@b.co'); await page.fill('#cf-subject', 'Hello'); await page.fill('#cf-message', 'A message that is long enough to pass.')
        ok_page = await with_endpoint('https://formspree.test/ok')
        await ok_page.route('https://formspree.test/ok', lambda r: asyncio.ensure_future(_slow_ok(r)))
        await fill(ok_page)
        await ok_page.click('form.cf button[type=submit]'); await ok_page.wait_for_timeout(150)
        check('loading state: button shows busy while sending', await ok_page.evaluate("document.querySelector('form.cf button[type=submit]').classList.contains('is-busy') && document.querySelector('form.cf').getAttribute('aria-busy') === 'true'"))
        await ok_page.wait_for_timeout(1000)
        check('form success state: shown only after the service answers OK', 'Message sent' in await ok_page.inner_text('[data-status]') and await ok_page.input_value('#cf-name') == '')
        bad_page = await with_endpoint('https://formspree.test/fail')
        await bad_page.route('https://formspree.test/fail', lambda r: r.fulfill(status=500, body='no'))
        await fill(bad_page)
        await bad_page.click('form.cf button[type=submit]'); await bad_page.wait_for_timeout(600)
        check('form error state: service failure is reported as not sent', 'Nothing was sent' in await bad_page.inner_text('[data-status]') and await bad_page.input_value('#cf-name') == 'Test')
        off_page = await with_endpoint('https://formspree.test/offline')
        await off_page.route('https://formspree.test/offline', lambda r: r.abort())
        await fill(off_page)
        await off_page.click('form.cf button[type=submit]'); await off_page.wait_for_timeout(600)
        check('form error state: offline is reported as not sent', 'could not be sent' in await off_page.inner_text('[data-status]'))

        # --- footer: last updated + privacy line, and no cookies were set anywhere
        foot = await pg.inner_text('.foot__base')
        check('footer: last updated date and privacy note', 'Last updated' in foot and 'No cookies' in foot, foot)
        check('footer: copyright year is current', str(__import__('datetime').date.today().year) in foot)
        check('privacy: the site sets no cookies (so no cookie banner is needed)', len(await ctx.cookies()) == 0)

        # --- certificate viewer with loading state
        await pg.goto(BASE + '/education/'); await pg.wait_for_timeout(600)
        await pg.click('.cc__thumb >> nth=0'); await pg.wait_for_timeout(800)
        check('certificate viewer: opens and loads the full image', await pg.evaluate("document.getElementById('cert-dialog').open && document.querySelector('#cert-dialog img').naturalWidth > 0"))
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(200)
        check('certificate viewer: closes with Escape', not await pg.evaluate("document.getElementById('cert-dialog').open"))

        # --- mobile menu
        m = await b.new_context(viewport={'width': 390, 'height': 844}, has_touch=True, is_mobile=True)
        mp = await m.new_page(); await mp.goto(BASE + '/'); await mp.wait_for_timeout(500)
        await mp.tap('.nav__toggle'); await mp.wait_for_timeout(300)
        check('mobile menu: opens', await mp.get_attribute('.nav__toggle', 'aria-expanded') == 'true')
        check('mobile menu: theme toggle stays reachable', await mp.is_visible('[data-theme-toggle]'))
        await mp.keyboard.press('Escape'); await mp.wait_for_timeout(200)
        check('mobile menu: closes with Escape', await mp.get_attribute('.nav__toggle', 'aria-expanded') == 'false')

        check('no console or page errors during the whole run', not errs, str(errs[:3]))
        await b.close()
    srv.shutdown()
    failed = [n for n, ok in results if not ok]
    print(json.dumps({'checks': len(results), 'failed': failed}))
    sys.exit(1 if failed else 0)

async def _slow_ok(route):
    await asyncio.sleep(0.6)
    await route.fulfill(status=200, body='{"ok":true}', content_type='application/json')

asyncio.run(main())
