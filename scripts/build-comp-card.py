"""Rebuild the comp card with the corrected name and without the phone number (Phase 1, Q2 default).

Layout, fonts (Times-Roman + Helvetica) and photos are taken from the original
Sebastian_Nicoras_CompCard.pdf so the only content changes are:
  1. "SEBASTIAN NICORAS" -> "Sebastiano Nicoras" (brief: this spelling everywhere)
  2. the phone number is removed (not among the confirmed facts)
  3. PDF metadata (title, author, subject) is filled in
Measurements are the confirmed values from the brief.

Usage: python3 scripts/build-comp-card.py <dir-with-img-000..003.jpg extracted by pdfimages> <output.pdf>
"""
import sys
from reportlab.lib.colors import Color
from reportlab.pdfgen import canvas

SRC, OUT = sys.argv[1], sys.argv[2]
W, H = 612, 792  # US Letter, as the original

BG = Color(245 / 255, 243 / 255, 238 / 255)
INK = Color(16 / 255, 17 / 255, 19 / 255)
GREY = Color(110 / 255, 116 / 255, 124 / 255)
RULE = Color(221 / 255, 216 / 255, 204 / 255)

NAME = "SEBASTIANO NICORAS"
EMAIL = "sebastiano.nicoras@gmail.com"
INSTAGRAM = "@sebastiano.nicoras"
MEASUREMENTS = [
    ("HEIGHT", "181 cm / 5'11\""), ("WEIGHT", "74 kg / 162 lbs"), ("CHEST", "99 cm / 39\""),
    ("WAIST", "81 cm / 31.5\""), ("HIPS", "95 cm / 37\""), ("SHOES", "42 EU / 9-9.5 US"),
    ("SUIT", "50 EU"), ("EYES", "Brown"), ("HAIR", "Black"),
]


def tracked(c, text, x, y, font, size, spacing, color, anchor="center"):
    c.setFont(font, size)
    c.setFillColor(color)
    width = c.stringWidth(text, font, size) + spacing * (len(text) - 1)
    start = {"center": x - width / 2, "left": x, "right": x - width}[anchor]
    t = c.beginText(start, y)
    t.setFont(font, size)
    t.setCharSpace(spacing)
    t.textLine(text)
    c.drawText(t)


def background(c):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, stroke=0, fill=1)


def footer(c, page):
    tracked(c, f"{NAME} — MODEL COMP CARD", 48, 30, "Helvetica", 6, 0.6, GREY, "left")
    tracked(c, f"PAGE {page} / 2", W - 48, 30, "Helvetica", 6, 0.6, GREY, "right")


c = canvas.Canvas(OUT, pagesize=(W, H))
c.setTitle("Sebastiano Nicoras — Model Comp Card")
c.setAuthor("Sebastiano Nicoras")
c.setSubject("Men's fashion model — measurements and contact")

# Page 1 — cover
background(c)
tracked(c, NAME, W / 2, H - 88, "Times-Roman", 29, 3.4, INK)
tracked(c, "MEN'S FASHION MODEL", W / 2, H - 108, "Helvetica", 7, 2.4, GREY)
img_w, img_h = 316, 395
c.drawImage(f"{SRC}/img-000.jpg", (W - img_w) / 2, H - 150 - img_h, img_w, img_h)
tracked(c, "181 CM · 74 KG · CHEST 99 · WAIST 81 · SHOES 42", W / 2, H - 584, "Helvetica", 8.5, 1.8, INK)
c.setStrokeColor(RULE)
c.setLineWidth(0.6)
c.line(W / 2 - 40, H - 606, W / 2 + 40, H - 606)
tracked(c, EMAIL, W / 2, H - 632, "Helvetica", 8, 0.3, INK)
tracked(c, INSTAGRAM, W / 2, H - 648, "Helvetica", 8, 0.3, INK)
footer(c, 1)
c.showPage()

# Page 2 — selected work + measurements
background(c)
tracked(c, "SELECTED WORK", W / 2, H - 78, "Times-Roman", 20, 3, INK)
tracked(c, "PORTFOLIO", W / 2, H - 98, "Helvetica", 7, 2.4, GREY)
pw, ph, gap, top = 162, 215, 14, H - 140
x0 = (W - (3 * pw + 2 * gap)) / 2
for i in range(3):
    x = x0 + i * (pw + gap)
    c.drawImage(f"{SRC}/img-00{i + 1}.jpg", x, top - ph, pw, ph)
    c.setStrokeColor(RULE)
    c.rect(x, top - ph, pw, ph, stroke=1, fill=0)
tracked(c, "MEASUREMENTS", W / 2, H - 405, "Times-Roman", 16, 2.6, INK)
col_x = [x0, x0 + pw + gap, x0 + 2 * (pw + gap)]
for i, (label, value) in enumerate(MEASUREMENTS):
    row, col = divmod(i, 3)
    x, y = col_x[col], H - 434 - row * 42
    tracked(c, label, x, y, "Helvetica", 6, 0.6, GREY, "left")
    tracked(c, value, x, y - 14, "Times-Roman", 11, 0, INK, "left")
    c.setStrokeColor(RULE)
    c.line(x, y - 21, x + pw - 6, y - 21)
c.line(W / 2 - 80, H - 578, W / 2 + 80, H - 578)
tracked(c, f"{EMAIL}   ·   {INSTAGRAM}", W / 2, H - 596, "Helvetica", 8, 0.3, INK)
footer(c, 2)
c.showPage()
c.save()
print("written", OUT)
