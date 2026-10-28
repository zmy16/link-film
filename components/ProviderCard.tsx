"use client";

import Image from "next/image";
import type { RefObject } from "react";

import {
  accentClasses,
  getRegion,
  providerAccent,
  type Provider,
} from "@/lib/providers";
import { Tilt, useSpotlight } from "./motion/MotionFx";
import { IconArrowRight, IconPlay } from "./Icons";

type ProviderCardProps = {
  provider: Provider;
  index: number;
};

/**
 * Cinematic poster card. This project has no film posters, so the "poster" is
 * the provider's own logotype on a tinted, scrimmed 4:5 plate — it keeps the
 * streaming-app feel without inventing artwork that does not exist.
 *
 * A card always wears its OWN region accent, so the "Semua" view reads as two
 * interleaved colour families instead of one flat list.
 */
export default function ProviderCard({ provider, index }: ProviderCardProps) {
  const tone = accentClasses(providerAccent(provider));
  const region = getRegion(provider.region);
  const hasLink = provider.url.trim().length > 0;
  const spotlightRef = useSpotlight<HTMLElement>();

  const shell =
    "spotlight-host group relative flex aspect-[4/5] w-full flex-col overflow-hidden rounded-xl border border-line bg-elevated";

  const body = (
    <>
      <span aria-hidden="true" className={`absolute inset-0 ${tone.posterGlow}`} />
      <span aria-hidden="true" className={`absolute inset-0 ${tone.spotlight}`} />
      <span aria-hidden="true" className="poster-scrim absolute inset-0" />
      <span aria-hidden="true" className="glare" />

      <span className="relative flex items-start justify-between px-4 pt-4 sm:px-5">
        <span className="font-mono text-[10px] tabular-nums tracking-[0.14em] text-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] ${tone.badge}`}
        >
          {provider.quality}
        </span>
      </span>

      <span className="relative flex flex-1 items-center justify-center px-6">
        <Image
          src={provider.logo}
          alt=""
          width={128}
          height={128}
          sizes="(max-width: 640px) 80px, 112px"
          quality={92}
          placeholder="blur"
          className="poster-hover-scale h-20 w-20 object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.75)] sm:h-24 sm:w-24 md:h-28 md:w-28"
        />
      </span>

      <span className="relative block px-4 pb-4 sm:px-5 sm:pb-5">
        <span
          className={`block text-[9px] font-bold uppercase tracking-[0.22em] ${tone.text}`}
        >
          {provider.kicker}
        </span>
        <span className="mt-1.5 block font-display text-[17px] font-bold leading-tight tracking-tight text-ink sm:text-[20px]">
          {provider.name}
        </span>
        <span className="mt-1.5 block line-clamp-2 text-[11.5px] leading-relaxed text-ink-soft sm:text-[12.5px]">
          {provider.tagline}
        </span>
      </span>

      {hasLink ? (
        <span
          className={`relative flex items-center justify-between border-t border-line/80 px-4 py-3 transition-colors duration-300 sm:px-5 ${tone.ctaHover}`}
        >
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em]">
            <IconPlay size={9} aria-hidden="true" />
            Nonton
          </span>
          <span className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-60">
              {region.code}
            </span>
            <IconArrowRight
              size={13}
              aria-hidden="true"
              className="transition-transform duration-500 ease-cine group-hover:translate-x-1"
            />
          </span>
        </span>
      ) : (
        <span className="relative flex items-center justify-center border-t border-line/80 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
          Link tidak tersedia
        </span>
      )}
    </>
  );

  if (!hasLink) {
    return (
      <div
        ref={spotlightRef as RefObject<HTMLDivElement>}
        className={`${shell} opacity-70`}
        tabIndex={-1}
        aria-disabled="true"
        aria-label={`${provider.name} — link tidak tersedia`}
      >
        {body}
      </div>
    );
  }

  return (
    <Tilt className="w-full">
      <a
        ref={spotlightRef as RefObject<HTMLAnchorElement>}
        href={provider.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Buka ${provider.name} di tab baru — ${region.label}. ${provider.tagline}`}
        className={`${shell} ${tone.cardHover}`}
      >
        {body}
      </a>
    </Tilt>
  );
}
