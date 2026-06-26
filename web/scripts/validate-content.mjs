import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

const contentRoot = path.join(process.cwd(), "content");
const casesDir = path.join(contentRoot, "cases");

const localeSchema = z.enum(["pt", "en"]);
const tierSchema = z.enum(["A", "B"]);
const categorySchema = z.enum([
  "branding",
  "social-media",
  "campaign",
  "audiovisual",
  "photography",
  "event",
  "research",
]);

const mediaRefSchema = z
  .string()
  .min(1)
  .refine(
    (value) =>
      value.startsWith("/media/") || value.startsWith("http://") || value.startsWith("https://"),
    {
      message: "must be absolute http(s) URL or /media/... path",
    },
  );

const caseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "invalid slug format"),
  locale: localeSchema,
  title: z.string().min(3),
  client: z.string().min(1).optional(),
  year: z
    .string()
    .regex(/^\d{4}$/, "year must be YYYY")
    .optional(),
  tier: tierSchema,
  category: z.array(categorySchema).min(1),
  tags: z.array(z.string().min(1)).default([]),
  coverImage: mediaRefSchema,
  gallery: z.array(mediaRefSchema).min(1),
  video: z.string().optional(),
  tools: z.array(z.string().min(1)).default([]),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative(),
});

function isMarkdownCaseFile(fileName) {
  return /\.(pt|en)\.md$/.test(fileName) && !fileName.startsWith("_");
}

function parseFileName(fileName) {
  const match = fileName.match(/^(.+)\.(pt|en)\.md$/);
  if (!match) return null;
  return { slug: match[1], locale: match[2] };
}

function isVideoOptionalValid(video) {
  if (video == null || video === "") return true;
  return mediaRefSchema.safeParse(video).success;
}

async function main() {
  const files = (await fs.readdir(casesDir)).filter(isMarkdownCaseFile).sort();
  const errors = [];
  const localeBySlug = new Map();

  for (const fileName of files) {
    const parsedName = parseFileName(fileName);
    const filePath = path.join(casesDir, fileName);

    if (!parsedName) {
      errors.push(`${fileName}: expected <slug>.pt.md or <slug>.en.md format`);
      continue;
    }

    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);

    if (!parsed.content.trim()) {
      errors.push(`${fileName}: empty markdown body`);
    }

    const frontmatterResult = caseSchema.safeParse(parsed.data);
    if (!frontmatterResult.success) {
      for (const issue of frontmatterResult.error.issues) {
        const field = issue.path.join(".") || "frontmatter";
        errors.push(`${fileName}: ${field} ${issue.message}`);
      }
      continue;
    }

    const data = frontmatterResult.data;
    if (data.slug !== parsedName.slug) {
      errors.push(`${fileName}: slug mismatch (frontmatter=${data.slug}, file=${parsedName.slug})`);
    }
    if (data.locale !== parsedName.locale) {
      errors.push(
        `${fileName}: locale mismatch (frontmatter=${data.locale}, file=${parsedName.locale})`,
      );
    }
    if (!isVideoOptionalValid(data.video)) {
      errors.push(`${fileName}: video must be empty, /media/... or absolute http(s) URL`);
    }

    const locales = localeBySlug.get(data.slug) ?? new Set();
    locales.add(data.locale);
    localeBySlug.set(data.slug, locales);
  }

  for (const [slug, locales] of localeBySlug) {
    if (!locales.has("pt") || !locales.has("en")) {
      errors.push(`${slug}: missing locale pair (requires pt and en)`);
    }
  }

  if (errors.length > 0) {
    console.error("❌ Content validation failed:\n");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`✅ Content validation passed (${files.length} case files)`);
}

main().catch((error) => {
  console.error("❌ Content validation crashed:", error);
  process.exit(1);
});
