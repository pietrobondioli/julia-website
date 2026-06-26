"use client";

import { useLayoutEffect, useRef } from "react";

import gsap from "gsap";

type CinematicHeroProps = {
  kicker: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

export function CinematicHero({
  kicker,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
}: CinematicHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.set("[data-hero-item]", { opacity: 0, y: 32 });
      gsap.set("[data-hero-line]", { scaleX: 0, transformOrigin: "left center" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to("[data-hero-item='kicker']", { opacity: 1, y: 0, duration: 0.7 })
        .to(
          "[data-hero-item='title']",
          { opacity: 1, y: 0, duration: 0.9 },
          "<0.1",
        )
        .to("[data-hero-line]", { scaleX: 1, duration: 0.8 }, "<0.05")
        .to(
          "[data-hero-item='subtitle']",
          { opacity: 1, y: 0, duration: 0.75 },
          "<0.15",
        )
        .to("[data-hero-item='cta']", { opacity: 1, y: 0, duration: 0.6 }, "<0.2");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden rounded-3xl border border-black/10 bg-[var(--editorial-cream)] px-6 py-16 shadow-sm md:px-10 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,0,0,0.05),transparent_42%)]" />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-8">
        <p
          data-hero-item="kicker"
          className="text-xs uppercase tracking-[0.24em] text-black/60"
        >
          {kicker}
        </p>

        <div className="space-y-5">
          <h1
            data-hero-item="title"
            className="max-w-4xl text-4xl leading-[0.95] md:text-6xl lg:text-7xl"
          >
            {title}
          </h1>
          <span data-hero-line className="block h-px w-40 bg-black/50" />
        </div>

        <p
          data-hero-item="subtitle"
          className="max-w-2xl text-sm leading-relaxed text-black/70 md:text-base"
        >
          {subtitle}
        </p>

        <div data-hero-item="cta">
          <a
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full border border-black bg-black px-5 py-2.5 text-sm text-white transition hover:bg-black/85"
          >
            {ctaLabel}
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
