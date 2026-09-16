const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// The static export build (used for the public GitHub Pages deploy) can't
// include the admin routes: `output: "export"` requires every route to be
// statically renderable, and the admin pages/API routes read the request
// body and write to disk. So for this build only, they're moved out of
// `src/app` before `next build` runs, then moved back afterward.
const appDir = path.join(process.cwd(), "src", "app");
const excludedDirs = ["admin", "api"];
const stagingDir = path.join(process.cwd(), ".build-excluded");

function moveOut() {
  fs.mkdirSync(stagingDir, { recursive: true });
  for (const dir of excludedDirs) {
    const from = path.join(appDir, dir);
    const to = path.join(stagingDir, dir);
    if (fs.existsSync(from)) {
      fs.renameSync(from, to);
    }
  }
}

function moveBack() {
  for (const dir of excludedDirs) {
    const from = path.join(stagingDir, dir);
    const to = path.join(appDir, dir);
    if (fs.existsSync(from)) {
      fs.renameSync(from, to);
    }
  }
  if (fs.existsSync(stagingDir)) {
    fs.rmdirSync(stagingDir);
  }
}

try {
  moveOut();
  execSync("next build", {
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "true" },
  });
} finally {
  moveBack();
}
