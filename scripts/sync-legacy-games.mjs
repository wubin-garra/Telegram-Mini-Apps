import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourceRoot = path.join(root, "..", "projects");
const outputRoot = path.join(root, "public", "legacy-games");

const imageExtensions = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".svg",
]);

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function hasLocalSource() {
  return fs.existsSync(sourceRoot);
}

function resetDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  ensureDir(dirPath);
}

function copyFile(from, to) {
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
}

function copyDirectoryFiltered(fromDir, toDir, predicate) {
  ensureDir(toDir);

  for (const entry of fs.readdirSync(fromDir, { withFileTypes: true })) {
    const fromPath = path.join(fromDir, entry.name);
    const toPath = path.join(toDir, entry.name);

    if (entry.isDirectory()) {
      if (predicate(fromPath, entry)) {
        copyDirectoryFiltered(fromPath, toPath, predicate);
      }
      continue;
    }

    if (predicate(fromPath, entry)) {
      copyFile(fromPath, toPath);
    }
  }
}

function extractStreetBasketballTracks(sourceHtml) {
  const html = fs.readFileSync(sourceHtml, "utf8");
  const tracksMatch = html.match(/this\.bgmTracks\s*=\s*\[(.*?)\];/s);

  if (!tracksMatch) {
    throw new Error("Could not locate basketball BGM track list in source HTML.");
  }

  return new Set(
    Array.from(tracksMatch[1].matchAll(/'([^']+\.mp3)'/g), (match) =>
      match[1].normalize("NFC"),
    ),
  );
}

function syncTurtleRace() {
  const sourceFile = path.join(sourceRoot, "turtle-race", "turtle-race.html");
  const targetDir = path.join(outputRoot, "turtle-race");
  ensureDir(targetDir);
  copyFile(sourceFile, path.join(targetDir, "index.html"));
}

function syncMergeTurtle() {
  const sourceDir = path.join(sourceRoot, "merge-turtle");
  const targetDir = path.join(outputRoot, "merge-turtle");

  copyDirectoryFiltered(sourceDir, targetDir, (filePath, entry) => {
    if (entry.isDirectory()) return false;
    const ext = path.extname(filePath).toLowerCase();
    return entry.name === "merge-turtle.html" || imageExtensions.has(ext);
  });

  const htmlPath = path.join(targetDir, "merge-turtle.html");
  if (fs.existsSync(htmlPath)) {
    fs.renameSync(htmlPath, path.join(targetDir, "index.html"));
  }
}

function syncStreetBasketball() {
  const sourceDir = path.join(sourceRoot, "street-basketball");
  const targetDir = path.join(outputRoot, "street-basketball");
  const sourceHtml = path.join(sourceDir, "street-basketball.html");
  const streetBasketballTracks = extractStreetBasketballTracks(sourceHtml);

  copyDirectoryFiltered(sourceDir, targetDir, (filePath, entry) => {
    if (entry.isDirectory()) return false;
    const ext = path.extname(filePath).toLowerCase();
    return (
      entry.name === "street-basketball.html" ||
      imageExtensions.has(ext) ||
      streetBasketballTracks.has(entry.name.normalize("NFC"))
    );
  });

  copyFile(sourceHtml, path.join(targetDir, "index.html"));

  const legacyNamedHtml = path.join(targetDir, "street-basketball.html");
  if (fs.existsSync(legacyNamedHtml)) {
    fs.rmSync(legacyNamedHtml, { force: true });
  }
}

if (!hasLocalSource()) {
  console.log(
    "Skipped legacy game sync: local source project directories are unavailable. Using committed public/legacy-games assets.",
  );
  process.exit(0);
}

resetDir(outputRoot);
syncTurtleRace();
syncMergeTurtle();
syncStreetBasketball();

console.log("Synced legacy games into public/legacy-games");
