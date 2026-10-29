"""Browser QA over the built site (dist/). Needs: pip install playwright && playwright install chromium.
Run after `npm run build`:  python3 scripts/qa-browser.py
Checks every page at many widths: horizontal overflow, console and network errors, unique titles and
descriptions, one h1, alt text, dead links and buttons, plain-text emails, placeholder text, 3D scene mounting.
Exit code 1 if anything fails."""
import os, asyncio, functools, http.server, socketserver, threading, json, re, sys, pathlib
from playwright.async_api import async_playwright

DIST = pathlib.Path(__file__).resolve().parent.parent / 'dist'
PORT = 4399
WIDTHS = [int(x) for x in sys.argv[1].split(',')] if len(sys.argv) > 1 else [320, 360, 390, 414, 768, 1024, 1280, 1440, 1920]
THEME = os.environ.get('THEME', 'dark')  # run once with THEME=light as well
FORCE_3D = {390, 1440}  # software WebGL is slow, so the 3D scene is only forced at these widths
FLAGS = ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist', '--enable-unsafe-swiftshader']

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

pages = sorted('/' + str(p.parent.relative_to(DIST)).replace('index', '').strip('.') + ('/' if str(p.parent) != str(DIST) else '')
               for p in DIST.rglob('index.html'))
pages = sorted({('/' if p in ('//', '') else p.replace('//', '/')) for p in pages})
if (DIST / '404.html').exists(): pages.append('/404.html')
problems = []
def bad(msg): problems.append(msg); print('FAIL', msg)

async def main():
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), functools.partial(Quiet, directory=str(DIST)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f'http://127.0.0.1:{PORT}'
    titles, descs = {}, {}
    async with async_playwright() as p:
        b = await p.chromium.launch(args=FLAGS)
        for w in WIDTHS:
            ctx = await b.new_context(viewport={'width': w, 'height': 900}, has_touch=w < 1024, is_mobile=w < 600)
            await ctx.add_init_script(f"try{{localStorage.setItem('theme','{THEME}')}}catch(e){{}}")
            for path in pages:
                pg = await ctx.new_page(); errs = []
                pg.on('console', lambda m, errs=errs: errs.append(m.text) if m.type == 'error' else None)
                pg.on('pageerror', lambda e, errs=errs: errs.append(str(e)))
                pg.on('requestfailed', lambda r, errs=errs: errs.append('request failed: ' + r.url))
                await pg.goto(base + path + ('?scene=force' if w in FORCE_3D else ''), wait_until='load')
                await pg.wait_for_timeout(1500 if w in FORCE_3D else 400)
                over = await pg.evaluate('document.documentElement.scrollWidth - document.documentElement.clientWidth')
                if over > 0: bad(f'{w}px {path}: horizontal overflow {over}px')
                for e in errs:
                    if not path.startswith('/404') or 'status of 404' not in e: bad(f'{w}px {path}: {e}')
                if w == 1440:
                    info = await pg.evaluate('''() => ({
                      title: document.title, desc: document.querySelector('meta[name=description]')?.content || '',
                      h1: document.querySelectorAll('h1').length,
                      canonical: document.querySelector('link[rel=canonical]')?.href || '',
                      noAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
                      deadA: [...document.querySelectorAll('a')].filter(a => !a.getAttribute('href') || a.getAttribute('href') === '#').length,
                      btnNoType: [...document.querySelectorAll('button')].filter(x => !x.getAttribute('type')).length,
                      emptyBtn: [...document.querySelectorAll('button')].filter(x => !(x.textContent.trim() || x.getAttribute('aria-label'))).length,
                      emptyLink: [...document.querySelectorAll('a')].filter(x => !(x.textContent.trim() || x.getAttribute('aria-label'))).length,
                      mailLinks: document.querySelectorAll('a[href^=mailto]').length,
                      bareEmail: (document.body.innerText.match(/[\\w.+-]+@[\\w-]+\\.[\\w.]+/g) || []).length,
                      html: document.documentElement.outerHTML,
                      lang: document.documentElement.lang,
                      favicon: !!document.querySelector('link[rel=icon]'),
                      scene: document.querySelector('.scene') ? document.querySelector('.scene').className : null,
                    })''')
                    if info['title'] in titles.values(): bad(f'duplicate title on {path}: {info["title"]}')
                    titles[path] = info['title']
                    if info['desc'] in descs.values(): bad(f'duplicate description on {path}')
                    descs[path] = info['desc']
                    if not info['desc'] or len(info['desc']) > 200: bad(f'{path}: description length {len(info["desc"])}')
                    if not info['title'] or len(info['title']) > 70: bad(f'{path}: title length {len(info["title"])}')
                    if info['h1'] != 1: bad(f'{path}: {info["h1"]} h1 elements')
                    if not info['canonical'] and not path.startswith('/404'): bad(f'{path}: no canonical')
                    if info['noAlt']: bad(f'{path}: {info["noAlt"]} images without alt')
                    if info['deadA']: bad(f'{path}: {info["deadA"]} links with empty or # href')
                    if info['btnNoType']: bad(f'{path}: {info["btnNoType"]} buttons without type')
                    if info['emptyBtn'] or info['emptyLink']: bad(f'{path}: unnamed buttons/links')
                    if info['bareEmail'] > info['mailLinks'] + 3: bad(f'{path}: email shown as plain text')
                    if info['lang'] != 'en' or not info['favicon']: bad(f'{path}: lang/favicon')
                    if re.search(r'lorem ipsum|TODO|TBD|YOUR_DEPLOYED|placeholder text|coming soon', info['html'], re.I): bad(f'{path}: placeholder text found')
                    if w in FORCE_3D and info['scene'] and 'has-webgl' not in info['scene']: bad(f'{path}: 3D scene did not mount ({info["scene"]})')
                await pg.close()
            await ctx.close()
        await b.close()
    srv.shutdown()
    print(json.dumps({'pages': pages, 'widths': WIDTHS, 'problems': len(problems)}))
    sys.exit(1 if problems else 0)
asyncio.run(main())
