"""Renders public/og.png (1200x630 social preview) with headless Chromium. Run: python3 scripts/build-og.py"""
import asyncio, pathlib
from playwright.async_api import async_playwright
root = pathlib.Path(__file__).resolve().parent.parent
fonts = (root / 'public/fonts').as_uri()
slabs = ''
import math
for i in range(5):
    w = 150 * (1 - i * 0.07); h = w / 2; t = 13; cx = 300; cy = 372 - i * 52
    slabs += (f'<path d="M{cx-w} {cy}L{cx} {cy+h}L{cx} {cy+h+t}L{cx-w} {cy+t}Z" fill="#1d1020" stroke="#C8B8DB" stroke-opacity=".4"/>'
              f'<path d="M{cx} {cy+h}L{cx+w} {cy}L{cx+w} {cy+t}L{cx} {cy+h+t}Z" fill="#12091a" stroke="#C8B8DB" stroke-opacity=".4"/>'
              f'<path d="M{cx} {cy-h}L{cx+w} {cy}L{cx} {cy+h}L{cx-w} {cy}Z" fill="#502F4C" fill-opacity=".9" stroke="#C8B8DB" stroke-opacity=".6"/>')
html = f'''<html><head><style>
@font-face{{font-family:IS;src:url('{fonts}/instrument-serif-latin-400-normal.woff2')}}
@font-face{{font-family:G;src:url('{fonts}/geist-latin-wght-normal.woff2');font-weight:100 900}}
body{{margin:0;width:1200px;height:630px;background:#000;color:#F5EAEC;font-family:G;position:relative;overflow:hidden}}
.n{{position:absolute;left:72px;top:96px;font-family:IS;font-size:150px;line-height:.88;text-transform:uppercase}}
.h{{position:absolute;left:76px;bottom:96px;width:560px;font-size:28px;line-height:1.3;color:#C8B8DB;font-weight:520}}
.u{{position:absolute;left:76px;bottom:48px;font-size:20px;color:#a99ba8}}
svg{{position:absolute;right:20px;top:40px;width:560px;height:520px}}
.l{{position:absolute;left:0;right:0;bottom:0;height:6px;background:linear-gradient(90deg,#502F4C,#70587C,#C8B8DB)}}
</style></head><body><div class="n">Garv<br>Gupta</div>
<div class="h">Computer Science Engineering Graduate | DevOps &amp; Cloud Engineering</div>
<div class="u">garv-gupta-portfolio.bytexl.live</div>
<svg viewBox="0 0 600 500"><line x1="300" y1="120" x2="300" y2="420" stroke="#C8B8DB" stroke-width="2"/>{slabs}
<g transform="translate(300 98)"><path d="M0-46 34 0 0 46-34 0Z" fill="#C8B8DB"/><path d="M0-46 0 46M-34 0H34" stroke="#502F4C"/><circle r="64" fill="none" stroke="#C8B8DB" stroke-opacity=".35"/></g></svg>
<div class="l"></div></body></html>'''
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1200, 'height': 630})
        tmp = root / '.og-tmp.html'; tmp.write_text(html)
        await pg.goto(tmp.as_uri()); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(600)
        tmp.unlink()
        await pg.screenshot(path=str(root / 'public/og.png'))
        await b.close()
asyncio.run(main())
