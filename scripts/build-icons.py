"""Renders favicon.ico, apple-touch-icon.png and PWA icons from public/favicon.svg. Run: python3 scripts/build-icons.py"""
import asyncio, pathlib
from playwright.async_api import async_playwright
from PIL import Image
root = pathlib.Path(__file__).resolve().parent.parent
svg = (root / 'public/favicon.svg').read_text()
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for size, name in ((180, 'apple-touch-icon.png'), (192, 'icon-192.png'), (512, 'icon-512.png'), (48, '_ico48.png')):
            pg = await b.new_page(viewport={'width': size, 'height': size})
            await pg.set_content(f'<body style="margin:0;background:transparent">{svg.replace("<svg ", f"<svg width=\"{size}\" height=\"{size}\" ")}</body>')
            await pg.screenshot(path=str(root / 'public' / name), omit_background=True)
            await pg.close()
        await b.close()
asyncio.run(main())
im = Image.open(root / 'public/_ico48.png').convert('RGBA')
im.save(root / 'public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
(root / 'public/_ico48.png').unlink()
