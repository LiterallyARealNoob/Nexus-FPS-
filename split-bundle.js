// split-bundle.js
//
// Run this ONCE after pasting bundle.txt into your repo, to explode it
// back into the real folder/file structure.
//
// HOW TO RUN (pick whichever works in Spck):
//   node split-bundle.js
//
// It reads ./bundle.txt (must be in the same folder you run this from -
// i.e. your repo root) and writes every file it contains to the correct
// path, creating folders as needed. It will NOT overwrite a file that
// already has different content unless you delete it first - actually,
// to keep this simple, it just overwrites everything every time you run
// it, so don't run it again after you've started hand-editing files,
// or you'll wipe your edits back to the bundle's version.
//
// After running successfully, you can delete bundle.txt and this script -
// they're not part of the actual game.

const fs = require("fs");
const path = require("path");

const BUNDLE_PATH = path.join(__dirname, "bundle.txt");
const START = "##---FILE-START---##";
const END = "##---FILE-END---##";

function main() {
  if (!fs.existsSync(BUNDLE_PATH)) {
    console.error("bundle.txt not found next to this script. Place split-bundle.js in the same folder as bundle.txt and try again.");
    process.exit(1);
  }

  const raw = fs.readFileSync(BUNDLE_PATH, "utf8");
  const lines = raw.split("\n");

  let i = 0;
  let count = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith(START)) {
      const relPath = line.slice(START.length).trim();
      i++;

      const contentLines = [];
      while (i < lines.length && lines[i] !== END) {
        contentLines.push(lines[i]);
        i++;
      }
      // skip the END line itself
      i++;

      let content = contentLines.join("\n");
      // remove one trailing blank line we may have picked up before END
      if (content.endsWith("\n")) {
        content = content.slice(0, -1);
      }

      const fullPath = path.join(__dirname, relPath);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      const toWrite = content === "" ? "" : content + "\n";
      fs.writeFileSync(fullPath, toWrite, "utf8");
      count++;
      console.log("wrote:", relPath);
    } else {
      i++;
    }
  }

  console.log(`\nDone. Wrote ${count} files.`);
  console.log("Note: favicon.ico was NOT included in the bundle (binary file).");
  console.log("The site works without it, just no tab icon - you can add one later.");
}

main();
        
