import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { CaseEntry } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type CaseCardProps = {
  item: CaseEntry;
  locale: Locale;
  tierA: string;
  tierB: string;
  projectsPath: string;
  viewLabel: string;
};

export function CaseCard({ item, locale, tierA, tierB, projectsPath, viewLabel }: CaseCardProps) {
  return (
    <article className="group rounded-2xl border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.18em] text-black/45">
          {item.year ?? "—"}
        </span>
        <Badge variant="outline">{item.tier === "A" ? tierA : tierB}</Badge>
      </div>

      <h3 className="text-2xl leading-tight">{item.title}</h3>

      {item.client ? <p className="mt-2 text-sm text-black/65">{item.client}</p> : null}

      {item.tags?.length ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag) => (
            <li key={tag} className="rounded-full bg-black/5 px-2.5 py-1 text-xs text-black/70">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      <Link
        href={`/${locale}${projectsPath}/${item.slug}`}
        className="mt-6 inline-flex items-center gap-2 text-sm text-black/75 transition group-hover:text-black"
      >
        {viewLabel}
        <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
