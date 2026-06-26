/**
 * Upload raw portfolio media to Cloudinary and rewrite case markdown URLs.
 *
 * Usage:
 *   cd web
 *   cp .env.local.example .env.local
 *   # fill secrets in .env.local
 *   npm install
 *   npm run media:cloudinary
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const rootFolder = process.env.CLOUDINARY_FOLDER || "julia-portfolio";

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    "Missing Cloudinary vars. Fill CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET in web/.env.local",
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const rawRoot = path.join(repoRoot, "Portfólio - Julia Fialho");
const casesDir = path.join(repoRoot, "site", "content", "cases");

const rawProjectMap = {
  aura: " [Acadêmico] Aurá",
  "analise-semiotica-takis": "[Acadêmico] Análise Semiótica Takis",
  cinemark: "[Acadêmico] Cinemark",
  "here-i-go-again": "[Acadêmico] Here I Go Again",
  "natural-flow": "[Acadêmico] Natural Flow",
  "oba-hortifruti": "[Acadêmico] Oba Hortifruti",
  "the-body-shop": "[Acadêmico] The Body Shop",
  "vital-fresh": "[Acadêmico] Vital Fresh",
  "app-brasil": "[Agência PUC - Estágio] APP Brasil",
  "paraisopolis-site": "[Agência PUC - Estágio] Paraisópolis - Site",
  "jogos-universitarios-comunicacao-2024": "[Evento] Jogos Universitários Comunicação 2024",
  "semana-publicidade-2024": "[Evento] Semana de Publicidade 2024",
  freelancer: "[Freelancer]",
  "fotografia-mulheres-puc": "[Projeto Pessoal] Fotografia Mulheres PUC",
  "sanchez-rebranding": "[Projeto Voluntário] Sanchez",
};

const EXT_RESOURCE_TYPE = {
  ".mp4": "video",
  ".mov": "video",
  ".mkv": "video",
  ".webm": "video",
  ".pdf": "image",
  ".png": "image",
  ".jpg": "image",
  ".jpeg": "image",
  ".gif": "image",
  ".webp": "image",
  ".svg": "image",
  ".doc": "raw",
  ".docx": "raw",
};

function sanitizePublicIdPart(input) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9/_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-/]+|[-/]+$/g, "")
    .toLowerCase();
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(fullPath)));
    } else if (!entry.name.startsWith("._") && entry.name !== ".DS_Store") {
      out.push(fullPath);
    }
  }
  return out;
}

async function uploadFile(slug, absPath, relPath) {
  const ext = path.extname(absPath).toLowerCase();
  const resourceType = EXT_RESOURCE_TYPE[ext] || "raw";
  const relNoExt = relPath.slice(0, relPath.length - ext.length);
  const publicId = sanitizePublicIdPart(`${rootFolder}/${slug}/${relNoExt}`);

  const result = await cloudinary.uploader.upload(absPath, {
    resource_type: resourceType,
    public_id: publicId,
    overwrite: false,
    unique_filename: false,
    use_filename: false,
  });

  // secure_url works for image/video/raw
  return result.secure_url;
}

function parseYamlList(content, key) {
  const keyRegex = new RegExp(`^${key}:\\s*$`, "m");
  const match = content.match(keyRegex);
  if (!match || match.index == null) return [];

  const start = match.index + match[0].length;
  const rest = content.slice(start);
  const lines = rest.split("\n");
  const items = [];

  for (const line of lines) {
    if (line.startsWith("  - \"")) {
      items.push(line.replace(/^\s*-\s*"/, "").replace(/"\s*$/, ""));
      continue;
    }
    if (line.trim() === "") continue;
    if (!line.startsWith("  ")) break;
  }

  return items;
}

function parseYamlScalar(content, key) {
  const regex = new RegExp(`^${key}:\\s*"(.*)"\\s*$`, "m");
  const match = content.match(regex);
  return match ? match[1] : "";
}

function replaceYamlScalar(content, key, value) {
  const regex = new RegExp(`^${key}:\\s*".*"\\s*$`, "m");
  return content.replace(regex, `${key}: "${value}"`);
}

function replaceYamlList(content, key, values) {
  const startRegex = new RegExp(`^${key}:\\s*$`, "m");
  const startMatch = content.match(startRegex);
  if (!startMatch || startMatch.index == null) return content;

  const startIdx = startMatch.index;
  const before = content.slice(0, startIdx);
  const afterStart = content.slice(startIdx);
  const lines = afterStart.split("\n");

  let endLine = 1;
  while (endLine < lines.length) {
    const line = lines[endLine];
    if (line.startsWith("  - ") || line.trim() === "") {
      endLine++;
      continue;
    }
    if (!line.startsWith("  ")) break;
    endLine++;
  }

  const after = lines.slice(endLine).join("\n");
  const newBlock = [
    `${key}:`,
    ...values.map((v) => `  - "${v.replaceAll("\"", "\\\"")}"`),
  ].join("\n");

  return `${before}${newBlock}\n${after}`;
}

async function rewriteCaseFile(casePath, uploadMap) {
  const raw = await fs.readFile(casePath, "utf8");
  const gallery = parseYamlList(raw, "gallery");
  const coverImage = parseYamlScalar(raw, "coverImage");
  const video = parseYamlScalar(raw, "video");

  const mappedGallery = gallery.map((item) => uploadMap.get(item) || item);
  const mappedCover = uploadMap.get(coverImage) || coverImage;
  const mappedVideo = uploadMap.get(video) || video;

  let next = raw;
  next = replaceYamlList(next, "gallery", mappedGallery);
  next = replaceYamlScalar(next, "coverImage", mappedCover);
  next = replaceYamlScalar(next, "video", mappedVideo);

  if (next !== raw) {
    await fs.writeFile(casePath, next, "utf8");
    return true;
  }
  return false;
}

async function main() {
  const caseFiles = (await fs.readdir(casesDir))
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => path.join(casesDir, f));

  const uploadsBySlug = new Map();

  for (const [slug, rawFolder] of Object.entries(rawProjectMap)) {
    const projectPath = path.join(rawRoot, rawFolder);
    let files = [];
    try {
      files = await walk(projectPath);
    } catch {
      console.log(`Skip ${slug}: raw folder not found (${projectPath})`);
      continue;
    }

    const uploadMap = new Map();

    console.log(`\nUploading ${slug} (${files.length} files)...`);
    for (const absPath of files) {
      const rel = path.relative(projectPath, absPath).replaceAll("\\", "/");
      const localMediaRef = `/media/${slug}/${rel}`;

      try {
        const cloudUrl = await uploadFile(slug, absPath, rel);
        uploadMap.set(localMediaRef, cloudUrl);
        console.log(`  ✓ ${rel}`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`  ✗ ${rel} -> ${msg}`);
      }
    }

    uploadsBySlug.set(slug, uploadMap);
  }

  let rewritten = 0;
  for (const caseFile of caseFiles) {
    const fileName = path.basename(caseFile);
    const slug = fileName.replace(/\.(pt|en)\.md$/, "");
    const map = uploadsBySlug.get(slug);
    if (!map) continue;

    const changed = await rewriteCaseFile(caseFile, map);
    if (changed) {
      rewritten++;
      console.log(`Rewrote ${fileName}`);
    }
  }

  console.log(`\nDone. Rewritten case files: ${rewritten}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
