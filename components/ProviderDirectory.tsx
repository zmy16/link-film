"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import {
  DEFAULT_REGION,
  REGIONS,
  REGION_COUNTS,
  REGION_TABS,
  accentClasses,
  getRegion,
  parseRegionId,
  type Provider,
  type RegionId,
} from "@/lib/providers";
import {
  isEmptyQuery,
  normalize,
  prepareQuery,
  truncateQuery,
  MAX_QUERY_LENGTH,
} from "@/lib/normalize";
import EmptyState, { type EmptyVariant } from "./EmptyState";
import ProviderCard from "./ProviderCard";
import RegionTabs from "./RegionTabs";
import SearchBar from "./SearchBar";

const DEBOUNCE_MS = 200;
const MOTION_OK = "(prefers-reduced-motion: no-preference)";

type ProviderDirectoryProps = {
  /** provider id → address resolved from that provider's domain-info page. */
  liveUrls?: Record<string, string>;
};

/**
 * A provider is matched against every field the card actually shows, plus the
 * label of the region it belongs to — so "indonesia" finds the three local
 * sites from the "Semua" view too.
 */
function matches(provider: Provider, nq: string): boolean {
  const region = getRegion(provider.region);
  return (
    normalize(provider.name).includes(nq) ||
    normalize(provider.tagline).includes(nq) ||
    normalize(provider.kicker).includes(nq) ||
    normalize(provider.quality).includes(nq) ||
    // The card shows a "Rekomendasi" pill, so the word has to find it too.
    (provider.recommended === true && normalize("rekomendasi").includes(nq)) ||
    normalize(region.label).includes(nq) ||
    normalize(region.title).includes(nq) ||
    normalize(region.code).includes(nq)
  );
}

export default function ProviderDirectory({
  liveUrls,
}: ProviderDirectoryProps = {}) {
  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [regionId, setRegionId] = useState<RegionId>(DEFAULT_REGION);
  const [announcement, setAnnouncement] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  /* ---- query debounce: trailing edge, immediate on clear ------------- */
  useEffect(() => {
    const truncated = truncateQuery(rawQuery);
    if (truncated.length === 0 || isEmptyQuery(rawQuery)) {
      setQuery(rawQuery);
      return;
    }
    const timer = setTimeout(() => setQuery(rawQuery), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [rawQuery]);

  /* ---- URL ⇄ region: read once on mount, then keep in sync ---------- */
  useEffect(() => {
    const sync = () => {
      const params = new URLSearchParams(window.location.search);
      setRegionId(parseRegionId(params.get("region")));
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const selectRegion = useCallback((next: RegionId) => {
    setRegionId(next);
    const url = new URL(window.location.href);
    if (next === DEFAULT_REGION) url.searchParams.delete("region");
    else url.searchParams.set("region", next);
    window.history.pushState({ region: next }, "", url);
  }, []);

  const clearQuery = useCallback(() => {
    setRawQuery("");
    setQuery("");
  }, []);

  /* ---- filtering ---------------------------------------------------- */
  /*
   * A rotating-domain provider carries an info page as its static `url` plus a
   * server-resolved address in `liveUrls`. The resolved one is preferred — the
   * whole point is that the card links straight at the site that works now.
   *
   * It is passed to the card as its own prop rather than merged into a copied
   * provider object: copying gave every card a new identity on every region
   * switch, which defeated memoisation and made React rebuild the whole list.
   */
  const region = getRegion(regionId);
  const nq = prepareQuery(query);

  const filtered = useMemo(
    () => (nq === "" ? region.items : region.items.filter((p) => matches(p, nq))),
    [nq, region],
  );

  /** Best other region to send a stranded searcher to (ties: first declared). */
  const suggestion = useMemo(() => {
    if (nq === "" || region.id === "all") return null;
    const candidates = REGIONS.filter((r) => r.id !== region.id)
      .map((r) => ({
        region: r,
        count: r.items.filter((p) => matches(p, nq)).length,
      }))
      .filter((c) => c.count > 0)
      .sort((a, b) => b.count - a.count);
    return candidates[0] ?? null;
  }, [nq, region.id]);

  const variant: EmptyVariant =
    nq === "" && rawQuery.trim().length > 0
      ? "normalized-empty"
      : nq === ""
        ? "empty-region"
        : "no-results";

  /* ---- staggered card entrance, re-run on every real change ----------
   * GSAP, but split in two: the `set` runs in the layout effect (one style
   * write per card, cheap) and the tween is created on the next animation
   * frame. Creating the whole stagger inline held the first frame while GSAP
   * measured and re-animated every card, which is what made tapping a region
   * tab stutter — the animation itself is unchanged.
   */
  useGSAP(
    () => {
      const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-card]");
      if (!cards || cards.length === 0) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(cards, {
          y: 16,
          opacity: 0,
          duration: 0.45,
          ease: "expo.out",
          stagger: 0.035,
          force3D: true,
          overwrite: true,
        });
      });
      return () => mm.revert();
    },
    { scope: gridRef, dependencies: [regionId, query] },
  );

  /* ---- live-region announcement (only on real change) ---------------- */
  const previous = useRef<string | null>(null);
  useEffect(() => {
    const key = `${region.id}|${nq}|${filtered.length}`;
    if (previous.current === null) {
      previous.current = key;
      return;
    }
    if (previous.current === key) return;
    previous.current = key;

    if (nq === "") {
      setAnnouncement(`${region.label}, ${filtered.length} situs tersedia.`);
    } else {
      setAnnouncement(
        `${filtered.length} situs ditemukan untuk "${query.trim()}" di ${region.label}.`,
      );
    }
  }, [region.id, region.label, nq, filtered.length, query]);

  const tone = accentClasses(region.accent);

  return (
    <section aria-labelledby="directory-heading">
      {/* ---- control bar ---- */}
      <div className="sticky top-16 z-30 bg-base sm:bg-base/90 sm:backdrop-blur-xl">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
          <div className="flex flex-col gap-3 border-b border-line pb-3 pt-4 md:flex-row md:items-center md:justify-between">
            <RegionTabs
              regions={REGION_TABS}
              counts={REGION_COUNTS}
              value={regionId}
              onChange={selectRegion}
            />
            <SearchBar
              value={rawQuery}
              onChange={setRawQuery}
              onClear={clearQuery}
              maxLength={MAX_QUERY_LENGTH}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1120px] px-5 py-10 sm:px-8 sm:py-12">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line pb-5">
          <div>
            <h2
              id="directory-heading"
              className="font-display text-[24px] font-extrabold leading-tight tracking-tight text-ink sm:text-[30px]"
            >
              {region.title}
            </h2>
            <p className="mt-2 max-w-[58ch] text-[12.5px] leading-relaxed text-muted">
              {region.blurb}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${tone.bg}`}
            />
            <span className="tabular-nums">
              {filtered.length} / {region.items.length}
            </span>
            situs
          </span>
        </div>

        <div
          role="tabpanel"
          id={`panel-${region.id}`}
          aria-labelledby={`tab-${region.id}`}
          tabIndex={0}
          className="mt-7 rounded-xl [perspective:1100px] focus-visible:outline-offset-8"
        >
          {filtered.length > 0 ? (
            <div
              ref={gridRef}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((provider) => (
                <div key={provider.id} data-card className="w-full">
                  <ProviderCard provider={provider} url={liveUrls?.[provider.id]} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              variant={variant}
              query={query.trim()}
              regionLabel={region.label}
              suggestion={suggestion}
              onSuggestion={() => {
                if (suggestion) selectRegion(suggestion.region.id);
              }}
            />
          )}
        </div>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </section>
  );
}
