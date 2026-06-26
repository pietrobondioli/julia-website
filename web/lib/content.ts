import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import type { Locale } from "@/lib/i18n";

const root = path.join(process.cwd(), "content");

export type CaseMeta = {
  slug: string;
  locale: Locale;
  title: string;
  client?: string;
  year?: string;
  tier: "A" | "B";
  category?: string[];
  tags?: string[];
  coverImage?: string;
  gallery?: string[];
  video?: string;
  tools?: string[];
  featured?: boolean;
  order?: number;
};

export type CaseEntry = CaseMeta & {
  body: string;
  fileName: string;
};

export async function getCasesByLocale(locale: Locale): Promise<CaseEntry[]> {
  const dir = path.join(root, "cases");
  const files = await fs.readdir(dir);
  const localeFiles = files.filter(
    (name) => name.endsWith(`.${locale}.md`) && !name.startsWith("_"),
  );

  const entries = await Promise.all(
    localeFiles.map(async (fileName) => {
      const fullPath = path.join(dir, fileName);
      const raw = await fs.readFile(fullPath, "utf8");
      const parsed = matter(raw);
      const data = parsed.data as Partial<CaseMeta>;

      return {
        slug: data.slug ?? fileName.replace(`.${locale}.md`, ""),
        locale,
        title: data.title ?? "Untitled",
        client: data.client,
        year: data.year,
        tier: data.tier === "A" ? "A" : "B",
        category: data.category ?? [],
        tags: data.tags ?? [],
        coverImage: data.coverImage,
        gallery: data.gallery ?? [],
        video: data.video,
        tools: data.tools ?? [],
        featured: Boolean(data.featured),
        order: data.order ?? Number.MAX_SAFE_INTEGER,
        body: parsed.content.trim(),
        fileName,
      } satisfies CaseEntry;
    }),
  );

  return entries.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
}

export async function getCaseBySlug(locale: Locale, slug: string) {
  const cases = await getCasesByLocale(locale);
  return cases.find((item) => item.slug === slug);
}
