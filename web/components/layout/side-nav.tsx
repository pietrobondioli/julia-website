"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/lib/i18n";

type SideNavProps = {
  locale: Locale;
  labels: {
    home: string;
    projects: string;
    about: string;
    contact: string;
  };
  paths: {
    projects: string;
    about: string;
    contact: string;
  };
};

export function SideNav({ locale, labels, paths }: SideNavProps) {
  const pathname = usePathname();
  const base = `/${locale}`;

  const items = [
    { href: base, label: labels.home },
    { href: `${base}${paths.projects}`, label: labels.projects },
    { href: `${base}${paths.about}`, label: labels.about },
    { href: `${base}${paths.contact}`, label: labels.contact },
  ];

  return (
    <aside className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <nav className="rounded-2xl border border-black/10 bg-white/70 px-4 py-5 shadow-sm backdrop-blur">
        <ul className="space-y-3">
          {items.map((item, idx) => {
            const active = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "group flex items-center gap-3 text-sm transition-all",
                    active ? "text-black" : "text-black/60 hover:text-black",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "inline-block h-1.5 w-1.5 rounded-full transition-all",
                      active ? "bg-black scale-125" : "bg-black/30 group-hover:bg-black/70",
                    ].join(" ")}
                  />
                  <span className="tracking-wide">{item.label}</span>
                  <span className="ml-1 text-[10px] text-black/30">0{idx + 1}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
