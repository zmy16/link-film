"use client";

import { useRef } from "react";

import { accentClasses, type Region, type RegionId } from "@/lib/providers";

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
    <div
      role="tablist"
      aria-label="Region film"
      onKeyDown={handleKeyDown}
      className="flex w-full items-center gap-1 overflow-x-auto rounded-xl border border-line bg-surface/60 p-1 sm:w-auto"
    >
      {regions.map((region) => {
        const isActive = region.id === value;
        const accent = accentClasses(region.accent);

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
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-[12px] font-semibold transition-colors duration-300 sm:px-3.5",
              isActive
                ? `${accent.bg} ${accent.onAccent}`
                : "text-muted hover:bg-surface-2 hover:text-ink",
            ].join(" ")}
          >
            <span
              className={[
                "hidden font-mono text-[9px] font-bold uppercase tracking-[0.1em] sm:inline",
                isActive ? "opacity-60" : "text-muted/70",
              ].join(" ")}
            >
              {region.code}
            </span>
            <span className="whitespace-nowrap">
              <span className="sm:hidden">{region.short}</span>
              <span className="hidden sm:inline">{region.label}</span>
            </span>
            <span
              className={[
                "rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
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
