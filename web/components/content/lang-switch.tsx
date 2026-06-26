import Link from "next/link";

import type { Locale } from "@/lib/i18n";

type LangSwitchProps = {
  locale: Locale;
  pathAfterLocale?: string;
};

export function LangSwitch({ locale, pathAfterLocale = "" }: LangSwitchProps) {
  const other = locale === "pt" ? "en" : "pt";

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs uppercase tracking-[0.15em]">
      <span className={locale === "pt" ? "text-black" : "text-black/35"}>PT</span>
      <span className="text-black/30">/</span>
      <Link
        href={`/${other}${pathAfterLocale}`}
        className={locale === "en" ? "text-black" : "text-black/60 hover:text-black"}
      >
        EN
      </Link>
    </div>
  );
}
