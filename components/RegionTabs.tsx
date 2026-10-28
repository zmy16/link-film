"use client";

import { useRef } from "react";

import { IconGlobe, IconGrid, IconPin } from "@/components/Icons";
import { accentClasses, type Region, type RegionId } from "@/lib/providers";

/** One icon per region — the count chip alone reads as a number without a
 *  subject, and the mono "ALL / ID / INT" chips it replaced read as a
 *  dashboard widget rather than an editorial index. */
const REGION_ICON = {
  all: IconGrid,
  id: IconPin,
  int: IconGlobe,
} as const;

type RegionTabsProps = {
  regions: Region[];
  counts: Record<RegionId, number>;
  value: RegionId;
  onChange: (id: RegionId) => void;
};

/**
 * Segmented region switcher implementing the ARIA tabs pattern:
 * roving tabindex, Home/End + arrow keys with automatic activation.
 *
 * The active tab is tinted with its own region accent — gold for the
 * "everything" and Indonesia views, teal for international — so the dual-tone
 * system carries meaning rather than decoration.
 */
export default function RegionTabs({
  regions,
  counts,
  value,
  onChange,
}: RegionTabsProps) {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const index = regions.findIndex((region) => region.id === value);
    if (index < 0) return;

    let nextIndex = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % regions.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + regions.length) % regions.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = regions.length - 1;
    }

    if (nextIndex < 0) return;
    event.preventDefault();
    const next = regions[nextIndex];
    onChange(next.id);
    buttonRefs.current[next.id]?.focus();
  }

  return (
    // Mobile and tablet: the three tabs share the row equally (`flex-1`) and
    // the row is `w-full`, so the box never has a hollow strip on the right
    // and never needs a horizontal scroll — which it did below ~390px, hiding
    // the last tab on most phones. Icons and count chips are dropped at the
    // narrowest widths (they cost ~20px and ~23px per tab) and return as soon
    // as there is room. Only once the bar becomes a row with the search field
    // (md) does the group hug its content and sit on the left.
    <div
      role="tablist"
      aria-label="Region film"
      onKeyDown={handleKeyDown}
      className="flex w-full items-center gap-1 rounded-xl border border-line bg-surface/60 p-1 md:w-fit"
    >
      {regions.map((region) => {
        const isActive = region.id === value;
        const accent = accentClasses(region.accent);
        const RegionIcon = REGION_ICON[region.id];

        return (
          <button
            key={region.id}
            ref={(node) => {
              buttonRefs.current[region.id] = node;
            }}
            type="button"
            role="tab"
            id={`tab-${region.id}`}
            aria-selected={isActive}
            aria-controls={`panel-${region.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(region.id)}
            className={[
              // h-9 fixes the tab height so no child can inflate it: the count
              // chip used to inherit a 24px line-height from a colliding
              // `text-base` utility, which pushed the active tab to 44px while
              // its neighbours stayed at 35px.
              "flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-1.5 text-[11px] font-semibold transition-colors duration-300 sm:gap-2 sm:px-3.5 sm:text-[12px] md:flex-none",
              isActive
                ? `${accent.bg} ${accent.onAccent}`
                : "text-muted hover:bg-surface-2 hover:text-ink",
            ].join(" ")}
          >
            <RegionIcon
              size={14}
              aria-hidden="true"
              className={`hidden shrink-0 min-[480px]:block ${isActive ? "opacity-75" : "opacity-70"}`}
            />
            <span className="truncate whitespace-nowrap">
              <span className="sm:hidden">{region.short}</span>
              <span className="hidden sm:inline">{region.label}</span>
            </span>
            <span
              className={[
                // Explicit box: identical in both states whatever line-height
                // or font-size a future class may introduce.
                "hidden h-[17px] min-w-[17px] items-center justify-center rounded px-1 text-[9.5px] font-bold leading-none tabular-nums min-[400px]:inline-flex sm:h-[18px] sm:min-w-[18px] sm:px-1.5 sm:text-[10px]",
                isActive ? "bg-base/20" : "bg-surface-2 text-muted",
              ].join(" ")}
            >
              {counts[region.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
