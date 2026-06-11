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

function patchStreetBasketballHtml(html) {
  const override = `
// Override heavyweight audio tracks in the Mini App host build.
SoundManager.prototype.startBGM = function() {
  if (!this.bgmEnabled || this.bgmPlaying) return;
  this.bgmPlaying = true;
  this.bgmUsingReal = false;
  this.currentTrackName = 'Synth Arena Mix';
  if (this.ctx) {
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = 0.12;
    this.bgmGain.connect(this.ctx.destination);
    this._playBGMLoop();
  }
};
SoundManager.prototype._playNextTrack = function() { return; };

const soundManager = new SoundManager();
`;

  return html.replace("const soundManager = new SoundManager();", override);
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

  copyDirectoryFiltered(sourceDir, targetDir, (filePath, entry) => {
    if (entry.isDirectory()) return false;
    const ext = path.extname(filePath).toLowerCase();
    return entry.name === "street-basketball.html" || imageExtensions.has(ext);
  });

  const sourceHtml = path.join(sourceDir, "street-basketball.html");
  const html = fs.readFileSync(sourceHtml, "utf8");
  fs.writeFileSync(path.join(targetDir, "index.html"), patchStreetBasketballHtml(html));

  const legacyNamedHtml = path.join(targetDir, "street-basketball.html");
  if (fs.existsSync(legacyNamedHtml)) {
    fs.rmSync(legacyNamedHtml, { force: true });
  }
}

resetDir(outputRoot);
syncTurtleRace();
syncMergeTurtle();
syncStreetBasketball();

console.log("Synced legacy games into public/legacy-games");
