import { execFile } from "node:child_process";
import { chmod } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const hookPath = path.join(repoRoot, ".husky", "pre-commit");

async function main() {
  await chmod(hookPath, 0o755);
  await execFileAsync("git", ["config", "core.hooksPath", ".husky"], { cwd: repoRoot });
  console.log("✅ Git hooks installed (core.hooksPath=.husky)");
}

main().catch((error) => {
  console.error("❌ Failed installing hooks:", error);
  process.exit(1);
});
