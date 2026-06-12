import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicStreetballDir = path.join(
  root,
  "public",
  "legacy-games",
  "street-basketball",
);
const outputStreetballDir = path.join(
  root,
  ".vercel",
  "output",
  "static",
  "legacy-games",
  "street-basketball",
);

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyAudioFiles() {
  if (!fs.existsSync(publicStreetballDir) || !fs.existsSync(outputStreetballDir)) {
    console.log("Skipped prebuilt audio sync: source or output streetball directory is missing.");
    return;
  }

  const audioFiles = fs
    .readdirSync(publicStreetballDir)
    .filter((fileName) => fileName.toLowerCase().endsWith(".mp3"));

  for (const fileName of audioFiles) {
    ensureDir(outputStreetballDir);
    fs.copyFileSync(
      path.join(publicStreetballDir, fileName),
      path.join(outputStreetballDir, fileName),
    );
  }

  console.log(`Synced ${audioFiles.length} basketball audio files into .vercel/output/static`);
}

copyAudioFiles();
