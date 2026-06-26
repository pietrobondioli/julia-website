import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

const casesDir = path.join(process.cwd(), "content", "cases");
const requestTimeoutMs = 12000;

function isCaseMarkdown(fileName) {
  return fileName.endsWith(".md") && !fileName.startsWith("_");
}

function normalizeRefs(frontmatter) {
  const refs = [];
  if (typeof frontmatter.coverImage === "string") refs.push(frontmatter.coverImage);
  if (Array.isArray(frontmatter.gallery))
    refs.push(...frontmatter.gallery.filter((item) => typeof item === "string"));
  if (typeof frontmatter.video === "string" && frontmatter.video) refs.push(frontmatter.video);
  return refs;
}

async function fetchWithTimeout(url, method = "HEAD") {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    return await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function checkRemote(url) {
  try {
    const head = await fetchWithTimeout(url, "HEAD");
    if (head.ok) return { ok: true, status: head.status };

    if (head.status === 405 || head.status === 403) {
      const get = await fetchWithTimeout(url, "GET");
      if (get.ok) return { ok: true, status: get.status };
      return { ok: false, status: get.status, reason: `GET ${get.status}` };
    }

    return { ok: false, status: head.status, reason: `HEAD ${head.status}` };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
}

async function main() {
  const files = (await fs.readdir(casesDir)).filter(isCaseMarkdown).sort();

  const localErrors = [];
  const remoteChecks = new Map();

  for (const fileName of files) {
    const filePath = path.join(casesDir, fileName);
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    const refs = normalizeRefs(parsed.data);

    for (const ref of refs) {
      if (ref.startsWith("/media/")) {
        localErrors.push(`${fileName}: local media ref still present -> ${ref}`);
        continue;
      }

      if (ref.startsWith("http://") || ref.startsWith("https://")) {
        if (!remoteChecks.has(ref)) {
          remoteChecks.set(ref, []);
        }
        remoteChecks.get(ref).push(fileName);
      }
    }
  }

  const remoteErrors = [];
  const urls = [...remoteChecks.keys()];
  for (const url of urls) {
    const result = await checkRemote(url);
    if (!result.ok) {
      remoteErrors.push(
        `${url} :: ${result.reason ?? "request failed"} :: referenced by ${[...new Set(remoteChecks.get(url))].join(", ")}`,
      );
    }
  }

  if (localErrors.length > 0 || remoteErrors.length > 0) {
    console.error("❌ Media checks failed:\n");
    for (const error of localErrors) {
      console.error(`- ${error}`);
    }
    for (const error of remoteErrors) {
      console.error(`- ${error}`);
    }
    console.error(
      `\nSummary: ${localErrors.length} local refs, ${remoteErrors.length} broken remote URLs`,
    );
    process.exit(1);
  }

  console.log(`✅ Media checks passed (${urls.length} remote URLs checked, no local /media refs)`);
}

main().catch((error) => {
  console.error("❌ Media checker crashed:", error);
  process.exit(1);
});
