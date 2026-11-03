// One-off image pipeline (Phase 1 image plan): re-encode originals into web masters.
// Usage: node scripts/optimize-images.mjs <source-dir-with-portfolio-and-polaroids> <public-dir>
// - long edge ≤ 2400 px (never enlarged), sRGB, JPEG q82 mozjpeg, all metadata stripped (sharp default).
// - next/image then serves AVIF/WebP at the requested sizes; these files are only the masters.
// sharp ships with Next.js (image optimisation), so no extra dependency is installed for this script.
import sharp from "sharp";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { cover, portfolio, polaroids, hero } from "../src/content/images.ts";

const [, , srcDir, outDir] = process.argv;
if (!srcDir || !outDir) {
  console.error("usage: node scripts/optimize-images.mjs <src> <public>");
  process.exit(1);
}

const jobs = [cover, ...portfolio, ...polaroids, hero].filter(
  (img, i, all) => all.findIndex((o) => o.file === img.file) === i,
);

for (const img of jobs) {
  const base = img.file.replace(/\.jpe?g$/i, "");
  const from = [".jpg", ".jpeg"].map((ext) => join(srcDir, img.dir, base + ext)).find((p) => existsSync(p));
  if (!from) throw new Error(`missing source for ${img.dir}/${img.file}`);
  const to = join(outDir, img.dir, img.file);
  mkdirSync(join(outDir, img.dir), { recursive: true });
  const info = await sharp(from)
    .rotate()
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .toColourspace("srgb")
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(to);
  const before = (statSync(from).size / 1024).toFixed(0);
  const after = (statSync(to).size / 1024).toFixed(0);
  console.log(`${img.dir}/${img.file}: ${before} KB -> ${after} KB, ${info.width}x${info.height}`);
}
