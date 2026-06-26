import fs from "node:fs/promises";
import path from "node:path";

import { rawProjectMap } from "@/lib/raw-project-map";

type Params = {
  params: Promise<{
    slug: string;
    parts?: string[];
  }>;
};

const contentTypes: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".mkv": "video/x-matroska",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function decodeSegments(segments: string[]) {
  return segments.map((s) => decodeURIComponent(s));
}

function insideBase(base: string, target: string) {
  const rel = path.relative(base, target);
  return rel && !rel.startsWith("..") && !path.isAbsolute(rel);
}

export async function GET(_: Request, { params }: Params) {
  const { slug, parts = [] } = await params;
  const rawFolder = rawProjectMap[slug];
  if (!rawFolder) return new Response("Not found", { status: 404 });

  const projectRoot = path.join(process.cwd(), "..", "Portfólio - Julia Fialho", rawFolder);
  const decodedParts = decodeSegments(parts);
  const targetPath = path.resolve(projectRoot, ...decodedParts);

  if (!insideBase(projectRoot, targetPath)) return new Response("Not found", { status: 404 });

  let file: Buffer;
  try {
    file = await fs.readFile(targetPath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const ext = path.extname(targetPath).toLowerCase();
  const contentType = contentTypes[ext] ?? "application/octet-stream";

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
