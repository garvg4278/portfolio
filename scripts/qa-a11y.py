"""Runs axe-core (WCAG 2 A/AA rules, including colour contrast) on every page in both themes.
Needs: npm i -D axe-core, playwright. Run after `npm run build`:  python3 scripts/qa-a11y.py
Exit code 1 if any violation is found."""
import asyncio, functools, http.server, json, pathlib, socketserver, sys, threading
from playwright.async_api import async_playwright

root = pathlib.Path(__file__).resolve().parent.parent
DIST = root / 'dist'
AXE = (root / 'node_modules/axe-core/axe.min.js').read_text()
PORT = 4397
WIDTHS = [1440, 390]
pages = sorted('/' + str(p.parent.relative_to(DIST)).strip('.') + '/' if p.parent != DIST else '/' for p in DIST.rglob('index.html'))
pages = sorted({p.replace('//', '/') for p in pages})

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

async def main():
    socketserver.TCPServer.allow_reuse_address = True
    srv = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), functools.partial(Quiet, directory=str(DIST)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    bad = 0; checked = 0
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for theme in ('dark', 'light'):
            for w in WIDTHS:
                ctx = await b.new_context(viewport={'width': w, 'height': 900})
                await ctx.add_init_script(f"try{{localStorage.setItem('theme','{theme}')}}catch(e){{}}")
                for path in pages:
                    pg = await ctx.new_page()
                    await pg.goto(f'http://127.0.0.1:{PORT}{path}', wait_until='load')
                    await pg.add_style_tag(content='*,*::before,*::after{transition:none!important;animation:none!important}.js [data-reveal]{opacity:1!important;transform:none!important}')
                    await pg.wait_for_timeout(300)
                    await pg.evaluate(AXE)
                    res = await pg.evaluate("axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa']}})")
                    checked += 1
                    for v in res['violations']:
                        bad += 1
                        nodes = '; '.join(n['target'][0] for n in v['nodes'][:3])
                        print(f"FAIL [{theme} {w}px] {path}: {v['id']} ({v['impact']}) x{len(v['nodes'])} {nodes}")
                    await pg.close()
                await ctx.close()
        await b.close()
    srv.shutdown()
    print(json.dumps({'pages_checked': checked, 'violations': bad}))
    sys.exit(1 if bad else 0)
asyncio.run(main())
