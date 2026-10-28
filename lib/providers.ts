import type { StaticImageData } from "next/image";

import rebahinLogo from "@/public/logos/rebahin.png";
import kitanontonLogo from "@/public/logos/kitanonton.png";
import ngefilm21Logo from "@/public/logos/ngefilm21.png";
import layarkaca21Logo from "@/public/logos/layarkaca21.png";
import idlixLogo from "@/public/logos/idlix.png";
import pusatfilmLogo from "@/public/logos/pusatfilm.png";

/**
 * Duta Film is referenced by its public path instead of a static import on
 * purpose. A static import gives the file a Turbopack content-hashed name
 * (`dutafilm.16~_qn6wp~.~8.png`), and the dev image optimizer hangs forever on
 * that name at w=640 — the width the browser picks for the 112px slot on a 2x
 * screen. The request never resolves, so next/image leaves its blur
 * placeholder on screen and the logo renders as a smudge. The same bytes served
 * from /logos/ optimise in ~0.2s. */
const dutafilmLogo = "/logos/dutafilm.png";

export type RegionId = "all" | "id" | "int";

export type Quality = "HD" | "Full HD" | "4K";

export type Accent = "gold" | "teal";

export type Provider = {
  /** Stable slug, used as React key. */
  id: string;
  name: string;
  /** Second line on the poster — the reason to pick this site. */
  tagline: string;
  quality: Quality;
  /** Destination site. An empty string renders a non-interactive card.
   *  For a provider whose domain rotates, this is the info page (the fallback). */
  url: string;
  /** The provider's "domain info" page, when it has one. The server reads it at
   *  request time to learn the CURRENT address, so the card links straight to
   *  the site and the visitor clicks once instead of twice. See lib/live-link.ts. */
  liveInfoUrl?: string;
  /** Short uppercase kicker shown above the name, e.g. "FILM & SERIES". */
  kicker: string;
  /** Static import, or a /public path when the file must bypass the hashed
   *  static-media name (see dutafilmLogo above). */
  logo: StaticImageData | string;
  region: Exclude<RegionId, "all">;
};

export type Region = {
  id: RegionId;
  /** Full label, used on ≥sm viewports and in announcements. */
  label: string;
  /** Compact label for narrow viewports. */
  short: string;
  /** Two-letter code rendered as a chip. Emoji flags are deliberately not
   *  used: Windows has no flag glyphs and renders them as empty boxes. */
  code: string;
  /** Heading shown above the grid. */
  title: string;
  blurb: string;
  accent: Accent;
  items: Provider[];
};

/** The two real regions — the source of truth for provider data. */
export const REGIONS: Region[] = [
  {
    id: "id",
    label: "Film Indonesia",
    short: "Indonesia",
    code: "ID",
    title: "Produksi Indonesia",
    blurb:
      "Situs lokal dengan koleksi film dan series Indonesia, plus judul mancanegara ber-subtitle Indonesia.",
    accent: "gold",
    items: [
      {
        id: "rebahin",
        name: "Rebahin",
        tagline: "Film & series Indonesia dan luar negeri dengan subtitle.",
        quality: "HD",
        url: "https://rebahinxxi3.online/",
        kicker: "Film & Series",
        logo: rebahinLogo,
        region: "id",
      },
      {
        id: "kita-nonton",
        name: "Kita Nonton",
        tagline: "Koleksi film & series Indonesia terlengkap, gratis.",
        quality: "HD",
        url: "https://kitanonton2.today/",
        kicker: "Gratis",
        logo: kitanontonLogo,
        region: "id",
      },
      {
        id: "ngefilm21",
        name: "NgeFilm21",
        tagline: "Film & series Indonesia dengan kualitas gambar tinggi.",
        quality: "Full HD",
        // ngefilm.live 301s here; the live domain is read from this page.
        url: "https://ngefilm.store/",
        liveInfoUrl: "https://ngefilm.store/",
        kicker: "Kualitas Tinggi",
        logo: ngefilm21Logo,
        region: "id",
      },
      {
        id: "pusatfilm",
        name: "PusatFilm21",
        tagline: "Film & serial TV subtitle Indonesia, katalog luas.",
        quality: "HD",
        url: "https://pusatfilm.id/php-information",
        liveInfoUrl: "https://pusatfilm.id/php-information",
        kicker: "Film & Serial",
        logo: pusatfilmLogo,
        region: "id",
      },
      {
        id: "dutafilm",
        name: "Duta Film",
        tagline: "Film, series, dan anime subtitle Indonesia, bisa diunduh.",
        quality: "HD",
        url: "https://sportingslammers.com/",
        kicker: "Bisa Diunduh",
        logo: dutafilmLogo,
        region: "id",
      },
    ],
  },
  {
    id: "int",
    label: "Film Luar Negeri",
    short: "Luar Negeri",
    code: "INT",
    title: "Box Office Internasional",
    blurb:
      "Judul Hollywood, Asia, dan Eropa — semuanya dengan subtitle Bahasa Indonesia.",
    accent: "teal",
    items: [
      {
        id: "layarkaca21",
        name: "Layar Kaca 21",
        tagline: "Film & series luar negeri dengan subtitle Bahasa Indonesia.",
        quality: "HD",
        url: "https://lk21.de/",
        kicker: "Sub Indo",
        logo: layarkaca21Logo,
        region: "int",
      },
      {
        id: "idlix",
        name: "IDLIX",
        tagline: "Film & series luar negeri terlengkap, update tiap hari.",
        quality: "4K",
        url: "https://idlixian.com/",
        kicker: "Update Harian",
        logo: idlixLogo,
        region: "int",
      },
    ],
  },
];

const ALL_PROVIDERS = REGIONS.flatMap((region) => region.items);

/** Indonesian number words, so the catch-all blurb below cannot go stale every
 *  time a provider is added or removed. */
const COUNT_WORDS = [
  "nol",
  "satu",
  "dua",
  "tiga",
  "empat",
  "lima",
  "enam",
  "tujuh",
  "delapan",
  "sembilan",
];

function countWord(count: number): string {
  return COUNT_WORDS[count] ?? String(count);
}

function regionSize(regionId: Exclude<RegionId, "all">): number {
  return REGIONS.find((region) => region.id === regionId)?.items.length ?? 0;
}

/** The "see everything" view — a synthetic region whose items are the
 *  concatenation of both real regions, in declaration order. */
export const ALL_REGION: Region = {
  id: "all",
  label: "Semua Situs",
  short: "Semua",
  code: "ALL",
  title: "Semua Provider",
  blurb: `Seluruh situs dalam direktori ini — ${countWord(regionSize("id"))} lokal Indonesia, ${countWord(regionSize("int"))} mancanegara — semuanya dengan subtitle Bahasa Indonesia.`,
  accent: "gold",
  items: ALL_PROVIDERS,
};

/** Tab order: the catch-all first, then the real regions. */
export const REGION_TABS: Region[] = [ALL_REGION, ...REGIONS];

export const DEFAULT_REGION: RegionId = "all";

export const TOTAL_PROVIDERS = ALL_PROVIDERS.length;

export function getRegion(id: RegionId): Region {
  return REGION_TABS.find((region) => region.id === id) ?? ALL_REGION;
}

/** Coerce an arbitrary string (e.g. from `?region=`) into a known region id. */
export function parseRegionId(value: string | null): RegionId {
  const match = REGION_TABS.find((region) => region.id === value);
  return match ? match.id : DEFAULT_REGION;
}

/** Counts for the tab chips. */
export const REGION_COUNTS = REGION_TABS.reduce(
  (acc, region) => {
    acc[region.id] = region.items.length;
    return acc;
  },
  {} as Record<RegionId, number>,
);

/**
 * Region accent → complete, literal Tailwind class strings.
 *
 * Written out in full (never built by string concatenation) so Tailwind's
 * content scanner can see every class; `lib/**` is registered in
 * `tailwind.config.ts` for exactly this reason.
 */
export function accentClasses(accent: Accent) {
  if (accent === "teal") {
    return {
      text: "text-teal",
      bg: "bg-teal",
      onAccent: "text-on-accent",
      border: "border-teal/45",
      posterGlow: "poster-glow-teal",
      spotlight: "spotlight-overlay spotlight-overlay-teal",
      badge: "border-teal/45 bg-base/70 text-teal",
      cardHover:
        "hover:border-teal/55 focus-visible:border-teal/55",
      ctaHover:
        "group-hover:border-transparent group-hover:bg-teal group-hover:text-on-accent",
    };
  }

  return {
    text: "text-gold",
    bg: "bg-gold",
    onAccent: "text-on-accent",
    border: "border-gold/45",
    posterGlow: "poster-glow-gold",
    spotlight: "spotlight-overlay",
    badge: "border-gold/45 bg-base/70 text-gold",
    cardHover:
      "hover:border-gold/55 focus-visible:border-gold/55",
    ctaHover:
      "group-hover:border-transparent group-hover:bg-gold group-hover:text-on-accent",
  };
}

/** A card always wears its OWN region accent, even in the "all" view. */
export function providerAccent(provider: Provider): Accent {
  return getRegion(provider.region).accent;
}
