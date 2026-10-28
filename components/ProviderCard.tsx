"use client";

import Image from "next/image";
import { memo } from "react";
import type { RefObject } from "react";

import {
  accentClasses,
  getRegion,
  providerAccent,
  type Provider,
} from "@/lib/providers";
import { Tilt, useSpotlight } from "./motion/MotionFx";
import { IconArrowRight, IconPlay, IconStar } from "./Icons";

type ProviderCardProps = {
  provider: Provider;
  /** Address to link to, when the server resolved a rotating domain for it. */
  url?: string;
};

/**
 * Cinematic poster card. This project has no film posters, so the "poster" is
 * the provider's own logotype on a tinted, scrimmed plate — it keeps the
 * streaming-app feel without inventing artwork that does not exist.
 *
 * A card always wears its OWN region accent, so the "Semua" view reads as two
 * interleaved colour families instead of one flat list.
 *
 * Memoised: switching region re-filters the list, and a card that keeps its
 * provider and its position has nothing new to show. Without this, every
 * switch rebuilt all seven cards — the one interaction that measurably
 * dropped frames on a throttled phone.
 */
function ProviderCardBase({ provider, url }: ProviderCardProps) {
  const tone = accentClasses(providerAccent(provider));
  const region = getRegion(provider.region);
  const href = url && url.trim().length > 0 ? url : provider.url;
  const hasLink = href.trim().length > 0;
  const spotlightRef = useSpotlight<HTMLElement>();

  const shell =
    // One ratio on every device. It used to be square on phones and a 4:5
    // poster from `sm` up, so the same card was a different shape depending on
    // the screen it was seen on — and the phone version (465px tall at 390px)
    // left a small logo marooned in a mostly empty plate. Square is the shape
    // that held up at every width: it keeps the card substantial, gives the
    // logo the room to be the thing you actually see, and stays identical from
    // a 320px phone to a 1920px desktop.
    "spotlight-host group relative flex aspect-square w-full flex-col overflow-hidden rounded-xl border border-line bg-elevated";

  const body = (
    <>
      <span aria-hidden="true" className={`absolute inset-0 ${tone.posterGlow}`} />
      <span aria-hidden="true" className={`absolute inset-0 ${tone.spotlight}`} />
      <span aria-hidden="true" className="poster-scrim absolute inset-0" />
      <span aria-hidden="true" className="glare" />

      {/* Folded corner, like a paper dog-ear: the card's own corner folded
          back over itself, the darker sliver along the hypotenuse is the
          crease underneath. The star sits upright inside the fold — a word in
          this space forced the flap to be a long ribbon, which stopped reading
          as a folded corner at all, and a tilted star just looked like a
          mistake. The link's aria-label still says "Direkomendasikan". */}
      {provider.recommended ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-10 h-[54px] w-[54px] [clip-path:polygon(0_0,100%_0,0_100%)]"
        >
          <span className={`absolute inset-0 ${tone.fold}`} />
          <span
            className={`absolute inset-0 translate-x-[-3px] translate-y-[-3px] ${tone.bg}`}
          />
          <IconStar
            size={16}
            className={`absolute left-[9px] top-[9px] ${tone.onAccent}`}
          />
        </span>
      ) : null}

      {/* Only the pills row now. The card used to open with a rank number
          (01, 02 …), which said nothing a visitor wanted and pushed the
          useful chips into a corner. */}
      <span className="relative flex flex-wrap items-center justify-end gap-1.5 px-4 pt-4">
        <span
          className={`rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] ${tone.badge}`}
        >
          {provider.quality}
        </span>
      </span>

      <span className="relative flex flex-1 items-center justify-center px-6 py-1">
        <Image
          src={provider.logo}
          alt=""
          width={128}
          height={128}
          // The logo is 40% of the card's inner width, and the card's width is
          // set by the grid (1 / 2 / 3 columns), so the honest size is these
          // three formulas. A flat "176px" (the widest case) made every phone
          // fetch the 640px variant — 15KB where ~7KB would do.
          sizes="(min-width: 1024px) 120px, (min-width: 640px) calc(20vw - 35px), calc(40vw - 35px)"
          quality={75}
          // A static import gets Next's generated blur placeholder; a /public
          // path cannot, and a transparent logo would show that blurred plate
          // through its clear pixels anyway.
          placeholder={typeof provider.logo === "string" ? "empty" : "blur"}
          // A share of the card, not a fixed px value: 40% of the plate looks
          // the same on a 280px phone card and an 470px tablet one, where a
          // fixed px logo was cramped on the small card and shrank on the big
          // one — the same card never looked quite the same twice.
          className="poster-hover-scale h-auto w-[40%] object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.75)]"
        />
      </span>

      <span className="relative block px-4 pb-4">
        <span
          className={`block text-[9px] font-bold uppercase tracking-[0.22em] ${tone.text}`}
        >
          {provider.kicker}
        </span>
        {/* One size at every breakpoint. The card is the same shape on every
            device now, so its type has to hold the same proportion too — it
            used to jump 17px → 20px at `sm`, which made the desktop card read
            differently from the phone one. */}
        <span className="mt-1.5 block font-display text-[19px] font-bold leading-tight tracking-tight text-ink">
          {provider.name}
        </span>
        <span className="mt-1.5 block line-clamp-2 text-[12px] leading-relaxed text-ink-soft">
          {provider.tagline}
        </span>
      </span>

      {hasLink ? (
        <span
          className={`relative flex items-center justify-between border-t border-line/80 px-4 py-3 transition-colors duration-300 ${tone.ctaHover}`}
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
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Buka ${provider.name} di tab baru — ${region.label}.${provider.recommended ? " Direkomendasikan." : ""} ${provider.tagline}`}
        className={`${shell} ${tone.cardHover}`}
      >
        {body}
      </a>
    </Tilt>
  );
}

export default memo(ProviderCardBase);
