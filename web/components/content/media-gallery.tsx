import type { Locale } from "@/lib/i18n";

type MediaGalleryProps = {
  locale: Locale;
  gallery?: string[];
  video?: string;
};

const imageExts = new Set(["png", "jpg", "jpeg", "webp", "gif", "svg"]);
const pdfExts = new Set(["pdf"]);
const videoExts = new Set(["mp4", "webm", "mov", "mkv"]);
const docExts = new Set(["doc", "docx"]);

function getExt(path: string) {
  const clean = path.split("?")[0]?.split("#")[0] ?? "";
  const ext = clean.split(".").pop();
  return (ext ?? "").toLowerCase();
}

function encodeMediaSrc(input: string) {
  if (!input.startsWith("/")) return encodeURI(input);
  return input
    .split("/")
    .map((segment, index) => (index === 0 ? "" : encodeURIComponent(segment)))
    .join("/");
}

function labels(locale: Locale) {
  if (locale === "pt") {
    return {
      gallery: "Galeria",
      video: "Vídeo",
      pdf: "PDF",
      document: "Documento",
      open: "Abrir em nova aba",
      fallback: "Seu navegador não exibiu este arquivo embutido.",
      openDocument: "Abrir documento",
    };
  }
  return {
    gallery: "Gallery",
    video: "Video",
    pdf: "PDF",
    document: "Document",
    open: "Open in new tab",
    fallback: "Your browser could not render this embedded file.",
    openDocument: "Open document",
  };
}

function EmbeddedPdf({
  src,
  openLabel,
  fallback,
}: {
  src: string;
  openLabel: string;
  fallback: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white">
      <iframe src={src} title="PDF preview" className="h-[70vh] w-full" loading="lazy" />
      <div className="border-t border-black/10 px-4 py-2 text-xs text-black/60">
        {fallback}{" "}
        <a href={src} target="_blank" rel="noreferrer" className="underline underline-offset-2">
          {openLabel}
        </a>
      </div>
    </div>
  );
}

export function MediaGallery({ locale, gallery = [], video }: MediaGalleryProps) {
  const text = labels(locale);
  const safeGallery = gallery.map(encodeMediaSrc);
  const safeVideo = video ? encodeMediaSrc(video) : "";
  const hasAnyMedia = Boolean(safeVideo) || safeGallery.length > 0;

  if (!hasAnyMedia) return null;

  return (
    <section className="space-y-5">
      <h2 className="text-2xl md:text-3xl">{text.gallery}</h2>

      {safeVideo ? (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.14em] text-black/55">{text.video}</p>
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-black">
            <video
              className="aspect-video w-full"
              controls
              playsInline
              preload="metadata"
              src={safeVideo}
            >
              <track kind="captions" />
            </video>
          </div>
        </div>
      ) : null}

      {safeGallery.length ? (
        <ul className="space-y-5">
          {safeGallery.map((src) => {
            const ext = getExt(src);

            if (imageExts.has(ext)) {
              return (
                <li
                  key={src}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt="Project media"
                    loading="lazy"
                    className="h-auto w-full object-cover"
                  />
                </li>
              );
            }

            if (pdfExts.has(ext)) {
              return (
                <li key={src} className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.14em] text-black/55">{text.pdf}</p>
                  <EmbeddedPdf src={src} openLabel={text.open} fallback={text.fallback} />
                </li>
              );
            }

            if (videoExts.has(ext)) {
              return (
                <li
                  key={src}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-black"
                >
                  <video
                    className="aspect-video w-full"
                    controls
                    playsInline
                    preload="metadata"
                    src={src}
                  >
                    <track kind="captions" />
                  </video>
                </li>
              );
            }

            if (docExts.has(ext)) {
              return (
                <li key={src} className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.14em] text-black/55">
                    {text.document}
                  </p>
                  <a
                    href={src}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-black/75 underline underline-offset-2"
                  >
                    {text.openDocument}
                  </a>
                </li>
              );
            }

            return (
              <li key={src} className="rounded-2xl border border-black/10 bg-white p-4">
                <a
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm underline underline-offset-2"
                >
                  {text.open}
                </a>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
