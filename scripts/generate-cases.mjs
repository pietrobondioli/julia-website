/**
 * generate-cases.mjs
 *
 * Scans "Portfólio - Julia Fialho/" raw asset folders and generates
 * PT and EN markdown case files in web/content/cases/.
 *
 * Run: node scripts/generate-cases.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RAW = path.join(ROOT, "Portfólio - Julia Fialho");
const OUT = path.join(ROOT, "web", "content", "cases");

// ── slugify ──────────────────────────────────────────────────────────────
function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-zA-Z0-9\s-]/g, "")  // keep alphanumeric, spaces, hyphens
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

// ── project definitions ──────────────────────────────────────────────────
// Hard-coded mapping from raw folder name (suffix after "] ") to project data.
// This ensures deterministic slugs and stable metadata irrespective of
// filesystem ordering.
const PROJECTS = [
  {
    rawName: " [Acadêmico] Aurá",
    slug: "aura",
    ptTitle: "Aurá — Brandbook",
    enTitle: "Aurá — Brandbook",
    client: "Aurá",
    year: "2024",
    tier: "B",
    category: ["branding", "research"],
    tagsPT: ["brandbook", "identidade-visual"],
    tagsEN: ["brandbook", "visual-identity"],
    tools: ["Photoshop", "Illustrator", "InDesign"],
    featured: false,
    order: 10,
  },
  {
    rawName: "[Acadêmico] Análise Semiótica Takis",
    slug: "analise-semiotica-takis",
    ptTitle: "Takis — Análise Semiótica",
    enTitle: "Takis — Semiotic Analysis",
    client: "Takis",
    year: "2024",
    tier: "B",
    category: ["research"],
    tagsPT: ["semiotica", "analise-de-marca"],
    tagsEN: ["semiotics", "brand-analysis"],
    tools: ["Photoshop", "Illustrator"],
    featured: false,
    order: 20,
  },
  {
    rawName: "[Acadêmico] Cinemark",
    slug: "cinemark",
    ptTitle: "Cinemark — Análise e Estudo de Marca",
    enTitle: "Cinemark — Brand Analysis & Study",
    client: "Cinemark",
    year: "2024",
    tier: "A",
    category: ["branding", "research"],
    tagsPT: ["analise-de-marca", "estudo-de-marca"],
    tagsEN: ["brand-analysis", "brand-study"],
    tools: ["Photoshop", "Illustrator", "Premiere"],
    featured: true,
    order: 2,
  },
  {
    rawName: "[Acadêmico] Here I Go Again",
    slug: "here-i-go-again",
    ptTitle: "Here I Go Again — Projeto Audiovisual",
    enTitle: "Here I Go Again — Audiovisual Project",
    client: "Here I Go Again",
    year: "2024",
    tier: "B",
    category: ["audiovisual"],
    tagsPT: ["audiovisual", "campanha"],
    tagsEN: ["audiovisual", "campaign"],
    tools: ["Premiere", "After Effects"],
    featured: false,
    order: 30,
  },
  {
    rawName: "[Acadêmico] Natural Flow",
    slug: "natural-flow",
    ptTitle: "Natural Flow — Apresentação de Marca",
    enTitle: "Natural Flow — Brand Presentation",
    client: "Natural Flow",
    year: "2024",
    tier: "B",
    category: ["branding"],
    tagsPT: ["apresentacao", "branding"],
    tagsEN: ["presentation", "branding"],
    tools: ["Photoshop", "Illustrator"],
    featured: false,
    order: 40,
  },
  {
    rawName: "[Acadêmico] Oba Hortifruti",
    slug: "oba-hortifruti",
    ptTitle: "Oba Hortifruti — Apresentação de Marca",
    enTitle: "Oba Hortifruti — Brand Presentation",
    client: "Oba Hortifruti",
    year: "2024",
    tier: "B",
    category: ["branding"],
    tagsPT: ["apresentacao", "branding"],
    tagsEN: ["presentation", "branding"],
    tools: ["Photoshop", "Illustrator"],
    featured: false,
    order: 50,
  },
  {
    rawName: "[Acadêmico] The Body Shop",
    slug: "the-body-shop",
    ptTitle: "The Body Shop — Análise e Estudo de Marca",
    enTitle: "The Body Shop — Brand Analysis & Study",
    client: "The Body Shop",
    year: "2024",
    tier: "A",
    category: ["branding", "social-media", "research"],
    tagsPT: ["analise-de-marca", "redes-sociais", "branding"],
    tagsEN: ["brand-analysis", "social-media", "branding"],
    tools: ["Photoshop", "Illustrator", "Premiere"],
    featured: true,
    order: 3,
  },
  {
    rawName: "[Acadêmico] Vital Fresh",
    slug: "vital-fresh",
    ptTitle: "Vital Fresh — Apresentação de Marca",
    enTitle: "Vital Fresh — Brand Presentation",
    client: "Vital Fresh",
    year: "2024",
    tier: "A",
    category: ["branding"],
    tagsPT: ["apresentacao", "branding"],
    tagsEN: ["presentation", "branding"],
    tools: ["Photoshop", "Illustrator"],
    featured: true,
    order: 4,
  },
  {
    rawName: "[Agência PUC - Estágio] APP Brasil",
    slug: "app-brasil",
    ptTitle: "APP Brasil — Estágio em Agência",
    enTitle: "APP Brasil — Agency Internship",
    client: "APP Brasil",
    year: "2024",
    tier: "B",
    category: ["social-media", "campaign"],
    tagsPT: ["estagio", "redes-sociais", "conteudo-digital"],
    tagsEN: ["internship", "social-media", "digital-content"],
    tools: ["Photoshop", "Illustrator", "Premiere"],
    featured: false,
    order: 60,
  },
  {
    rawName: "[Agência PUC - Estágio] Paraisópolis - Site",
    slug: "paraisopolis-site",
    ptTitle: "Paraisópolis — Site Institucional",
    enTitle: "Paraisópolis — Institutional Website",
    client: "Paraisópolis",
    year: "2024",
    tier: "A",
    category: ["campaign", "social-media"],
    tagsPT: ["site", "comunicacao", "design-digital"],
    tagsEN: ["website", "communication", "digital-design"],
    tools: ["Photoshop", "Figma", "WordPress"],
    featured: true,
    order: 5,
  },
  {
    rawName: "[Evento] Jogos Universitários Comunicação 2024",
    slug: "jogos-universitarios-comunicacao-2024",
    ptTitle: "Jogos Universitários de Comunicação 2024",
    enTitle: "University Communication Games 2024",
    client: "PUC-SP",
    year: "2024",
    tier: "B",
    category: ["event", "social-media", "photography"],
    tagsPT: ["evento", "fotografia", "redes-sociais"],
    tagsEN: ["event", "photography", "social-media"],
    tools: ["Photoshop", "Lightroom"],
    featured: false,
    order: 70,
  },
  {
    rawName: "[Evento] Semana de Publicidade 2024",
    slug: "semana-publicidade-2024",
    ptTitle: "Semana de Publicidade 2024",
    enTitle: "Advertising Week 2024",
    client: "PUC-SP",
    year: "2024",
    tier: "B",
    category: ["event", "social-media"],
    tagsPT: ["evento", "redes-sociais", "design"],
    tagsEN: ["event", "social-media", "design"],
    tools: ["Photoshop", "Illustrator", "Premiere"],
    featured: false,
    order: 80,
  },
  {
    rawName: "[Freelancer]",
    slug: "freelancer",
    ptTitle: "Freelancer — Projetos Avulsos",
    enTitle: "Freelancer — Independent Projects",
    client: "Diversos",
    year: "2024",
    tier: "B",
    category: ["social-media", "campaign", "audiovisual"],
    tagsPT: ["freelancer", "redes-sociais", "audiovisual"],
    tagsEN: ["freelancer", "social-media", "audiovisual"],
    tools: ["Photoshop", "Premiere", "After Effects"],
    featured: false,
    order: 90,
  },
  {
    rawName: "[Projeto Pessoal] Fotografia Mulheres PUC",
    slug: "fotografia-mulheres-puc",
    ptTitle: "Fotografia — Mulheres PUC",
    enTitle: "Photography — PUC Women",
    client: "PUC-SP",
    year: "2024",
    tier: "B",
    category: ["photography"],
    tagsPT: ["fotografia", "projeto-pessoal"],
    tagsEN: ["photography", "personal-project"],
    tools: ["Lightroom", "Photoshop"],
    featured: false,
    order: 100,
  },
  {
    rawName: "[Projeto Voluntário] Sanchez",
    slug: "sanchez-rebranding",
    ptTitle: "Sanchez Semijoias — Rebranding",
    enTitle: "Sanchez Jewelry — Rebranding",
    client: "Sanchez",
    year: "2024",
    tier: "A",
    category: ["branding", "social-media"],
    tagsPT: ["identidade-visual", "conteudo-digital"],
    tagsEN: ["visual-identity", "digital-content"],
    tools: ["Photoshop", "Illustrator"],
    featured: true,
    order: 1,
  },
];

// ── media file extensions we reference ───────────────────────────────────
const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]);
const VIDEO_EXTS = new Set([".mp4", ".mov", ".mkv", ".webm"]);
const DOC_EXTS = new Set([".pdf", ".doc", ".docx"]);

// Include images + PDFs/docs in gallery (per spec: "image/video/pdf/doc/docx acceptable")
const GALLERY_EXTS = new Set([...IMAGE_EXTS, ...DOC_EXTS]);

// ── scan folder for media files (recursive, flat list) ───────────────────
function scanMedia(folderPath) {
  const galleryItems = [];
  const videos = [];

  if (!fs.existsSync(folderPath)) return { galleryItems: [], videos: [] };

  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        // Skip macOS metadata files
        if (entry.name.startsWith("._") || entry.name === ".DS_Store") continue;
        if (GALLERY_EXTS.has(ext)) galleryItems.push(full);
        else if (VIDEO_EXTS.has(ext)) videos.push(full);
      }
    }
  }

  walk(folderPath);
  // Sort by full path for deterministic order
  galleryItems.sort();
  videos.sort();
  return { galleryItems, videos };
}

// ── build gallery paths ──────────────────────────────────────────────────
function buildGallery(slug, rawFolderPath) {
  const { galleryItems, videos } = scanMedia(rawFolderPath);
  const gallery = [];

  // Add images + PDFs/docs (up to 50 to keep file size reasonable)
  for (const itemPath of galleryItems.slice(0, 50)) {
    const rel = path.relative(rawFolderPath, itemPath);
    gallery.push(`/media/${slug}/${rel}`);
  }

  // Add videos as video field (first video found)
  let videoPath = "";
  if (videos.length > 0) {
    const rel = path.relative(rawFolderPath, videos[0]);
    videoPath = `/media/${slug}/${rel}`;
  }

  return { gallery, videoPath };
}

// ── generate markdown frontmatter ────────────────────────────────────────
function frontmatter({
  slug,
  locale,
  title,
  client,
  year,
  tier,
  category,
  tags,
  coverImage,
  gallery,
  video,
  tools,
  featured,
  order,
}) {
  const yaml = [
    "---",
    `slug: "${slug}"`,
    `locale: "${locale}"`,
    `title: "${title}"`,
    `client: "${client}"`,
    `year: "${year}"`,
    `tier: "${tier}"`,
    "category:",
    ...category.map((c) => `  - "${c}"`),
    "tags:",
    ...tags.map((t) => `  - "${t}"`),
    coverImage ? `coverImage: "${coverImage}"` : `coverImage: "/media/${slug}/cover.jpg"`,
    "gallery:",
    ...(gallery.length > 0
      ? gallery.map((g) => `  - "${g}"`)
      : [`  - "/media/${slug}/placeholder.jpg"`]),
    video ? `video: "${video}"` : 'video: ""',
    "tools:",
    ...tools.map((t) => `  - "${t}"`),
    `featured: ${featured}`,
    `order: ${order}`,
    "---",
  ].join("\n");
  return yaml;
}

// ── PT body template ─────────────────────────────────────────────────────
function ptBody(title) {
  return `# ${title}

## Contexto

[Descreva cenário, marca e momento do projeto.]

## Desafio

[Qual problema precisava ser resolvido?]

## Estratégia

[Quais decisões criativas e estratégicas foram tomadas?]

## Execução

[Como a ideia virou peças/campanha?]

## Resultados

[Quais impactos ou evidências de sucesso?]

## Aprendizados

[O que esse case mostra sobre seu repertório profissional?]`;
}

// ── EN body template ─────────────────────────────────────────────────────
function enBody(title) {
  return `# ${title}

## Context

[Describe brand context and timing.]

## Challenge

[What problem needed to be solved?]

## Strategy

[What were the key strategic and creative choices?]

## Execution

[How did the concept become actual campaign assets?]

## Results

[What outcomes or evidence of impact were achieved?]

## Learnings

[What does this case show about your professional range?]`;
}

// ── extract body from markdown with frontmatter ─────────────────────────
function extractBody(raw) {
  // Match frontmatter block between --- markers
  const match = raw.match(/^---[\s\S]*?---\n\n([\s\S]*)$/);
  if (match) return match[1].trim();
  // No frontmatter — return entire content
  return raw.trim();
}

// ── write file if changed ────────────────────────────────────────────────
function writeIfChanged(filePath, content) {
  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, "utf-8");
    if (existing === content) {
      console.log(`  ⏭  Unchanged: ${path.basename(filePath)}`);
      return false;
    }
  }
  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`  ✏️  ${path.basename(filePath)}`);
  return true;
}

// ── main ─────────────────────────────────────────────────────────────────
function main() {
  console.log("── Generating case files ──\n");

  let created = 0;
  let updated = 0;
  let unchanged = 0;

  for (const proj of PROJECTS) {
    const rawFolder = path.join(RAW, proj.rawName);
    const { gallery, videoPath } = buildGallery(proj.slug, rawFolder);

    // Determine cover: first gallery image, or generic
    const cover = gallery.length > 0 ? gallery[0] : `/media/${proj.slug}/cover.jpg`;

    // ── Helper: build file content (preserve existing body) ──────────
    function buildContent(locale, title, tags, defaultBodyFn) {
      const fm = frontmatter({
        ...proj,
        locale,
        title,
        tags,
        coverImage: cover,
        gallery,
        video: videoPath,
      });

      const filePath = path.join(OUT, `${proj.slug}.${locale}.md`);
      let body;
      if (fs.existsSync(filePath)) {
        // Preserve existing body content (user may have written narrative)
        const existing = fs.readFileSync(filePath, "utf-8");
        body = extractBody(existing);
      }
      if (!body) {
        body = defaultBodyFn(title);
      }

      return [fm, "", body, ""].join("\n");
    }

    // ── PT file ────────────────────────────────────────────────────────
    const ptPath = path.join(OUT, `${proj.slug}.pt.md`);
    const ptContent = buildContent("pt", proj.ptTitle, proj.tagsPT, ptBody);
    const ptExisted = fs.existsSync(ptPath);
    const ptWritten = writeIfChanged(ptPath, ptContent);
    if (ptWritten && ptExisted) updated++;
    else if (ptWritten && !ptExisted) created++;
    else unchanged++;

    // ── EN file ────────────────────────────────────────────────────────
    const enPath = path.join(OUT, `${proj.slug}.en.md`);
    const enContent = buildContent("en", proj.enTitle, proj.tagsEN, enBody);
    const enExisted = fs.existsSync(enPath);
    const enWritten = writeIfChanged(enPath, enContent);
    if (enWritten && enExisted) updated++;
    else if (enWritten && !enExisted) created++;
    else unchanged++;

    // Print gallery summary
    const itemCount = gallery.length;
    const hasVideo = videoPath ? "🎬" : "";
    console.log(`  📁 ${proj.slug}: ${itemCount} gallery items, ${hasVideo || "no video"}`);
    console.log("");
  }

  // ── summary ──────────────────────────────────────────────────────────
  console.log("── Summary ──");
  console.log(`  Projects processed: ${PROJECTS.length}`);
  console.log(`  Case files created: ${created}`);
  console.log(`  Case files updated: ${updated}`);
  console.log(`  Case files skipped (unchanged): ${unchanged}`);
  console.log(`  Total case files: ${PROJECTS.length * 2}`);
  console.log("── Done ──");
}

main();
