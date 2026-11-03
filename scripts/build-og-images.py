"""Open Graph images per locale, 1200x630 — same art direction as the site cover (v2.1, 2026-11-03).

The studio cover photo, full bleed and anchored to the top (the head is never cropped), a dark scrim at the
bottom, the name in Bodoni Moda (opsz 96) and one line in Inter.
Usage: python3 scripts/build-og-images.py <public-dir> <inter.woff2>
(Bodoni is read from <public-dir>/fonts; woff2 files are decoded with fontTools, which needs `brotli`.)
"""
import io
import sys
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

PUBLIC, INTER = sys.argv[1], sys.argv[2]
LINES = {
    "en": "Men's fashion model · Cluj-Napoca, Romania · International bookings",
    "ro": "Model de modă masculină · Cluj-Napoca, România · Booking internațional",
}


def font(woff2_path, size):
    """Decode a woff2 file to an in-memory TTF that Pillow can draw with."""
    buf = io.BytesIO()
    f = TTFont(woff2_path)
    f.flavor = None
    f.save(buf)
    buf.seek(0)
    return ImageFont.truetype(buf, size)


W, H = 1200, 630
photo = Image.open(f"{PUBLIC}/portfolio/STUDIO_01.jpg").convert("RGB")
scale = W / photo.width
photo = photo.resize((W, round(photo.height * scale)), Image.LANCZOS).crop((0, 0, W, H))  # top-anchored

scrim = Image.new("L", (1, H))
for y in range(H):
    t = max(0.0, (y - H * 0.45) / (H * 0.55))
    scrim.putpixel((0, y), round(255 * 0.72 * t))
scrim = scrim.resize((W, H))
black = Image.new("RGB", (W, H), (0, 0, 0))
base = Image.composite(black, photo, scrim)

name_font = font(f"{PUBLIC}/fonts/bm96-latin-normal-400.woff2", 96)
line_font = font(INTER, 24)
for lang, line in LINES.items():
    img = base.copy()
    d = ImageDraw.Draw(img)
    d.text((60, H - 190), "SEBASTIANO NICORAS", font=name_font, fill=(255, 255, 255))
    d.text((64, H - 70), line, font=line_font, fill=(235, 235, 235))
    img.save(f"{PUBLIC}/og/og-{lang}.jpg", quality=86, optimize=True, progressive=True)
    print(lang, img.size)
