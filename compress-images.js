const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const folders = ["public/portfolio", "public/polaroids"];

async function compressFolder(folder) {
  const files = fs.readdirSync(folder).filter((f) =>
    /\.(jpg|jpeg|png)$/i.test(f)
  );

  for (const file of files) {
    const filePath = path.join(folder, file);
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    const tempPath = filePath + ".tmp";

    await sharp(filePath)
      .resize({ width: 2000, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(tempPath);

    const newStats = fs.statSync(tempPath);
    const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2);

    fs.renameSync(tempPath, filePath);

    console.log(`${folder}/${file}: ${sizeMB}MB -> ${newSizeMB}MB`);
  }
}

async function run() {
  for (const folder of folders) {
    if (fs.existsSync(folder)) {
      console.log(`\nProcessing ${folder}...`);
      await compressFolder(folder);
    } else {
      console.log(`Folder not found: ${folder}`);
    }
  }
  console.log("\nDone!");
}

run();