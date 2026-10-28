"use client";

import { IconSearch, IconShuffle } from "./Icons";

export type EmptyVariant = "no-results" | "normalized-empty" | "empty-region";

type EmptyStateProps = {
  variant: EmptyVariant;
  query: string;
  regionLabel: string;
  /** Offered only for `no-results` when another region actually has matches. */
  suggestion: { region: { id: string; label: string }; count: number } | null;
  onSuggestion: () => void;
};

const copy: Record<
  EmptyVariant,
  { title: (q: string) => string; body: (region: string) => string }
> = {
  "no-results": {
    title: (q) => `Tidak ada hasil untuk “${q}”`,
    body: (region) =>
      `Belum ada provider di ${region} yang cocok dengan kata kunci itu. Coba kata lain, atau lihat region lain.`,
  },
  "normalized-empty": {
    title: () => "Pencarian tidak berisi karakter yang dapat dicocokkan",
    body: () =>
      "Simbol dan spasi saja tidak bisa dipakai untuk mencari. Ketik huruf atau angka — misalnya “rebahin” atau “film”.",
  },
  "empty-region": {
    title: () => "Belum ada film di region ini",
    body: () =>
      "Region ini masih kosong. Coba region lain untuk melihat daftar provider yang tersedia.",
  },
};

export default function EmptyState({
  variant,
  query,
  regionLabel,
  suggestion,
  onSuggestion,
}: EmptyStateProps) {
  const text = copy[variant];

  return (
    <div className="border-y border-line py-14">
      <div className="mx-auto flex max-w-[46ch] flex-col items-start sm:items-center sm:text-center">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-muted"
        >
          {variant === "no-results" ? (
            <IconSearch size={16} />
          ) : (
            <IconShuffle size={16} />
          )}
        </span>

        <p className="mt-5 font-display text-[17px] font-bold leading-snug tracking-tight text-ink">
          {text.title(query)}
        </p>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
          {text.body(regionLabel)}
        </p>

        {suggestion && (
          <button
            type="button"
            onClick={onSuggestion}
            className="group mt-6 inline-flex items-center gap-2 border-b border-teal/50 pb-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-teal transition-colors duration-300 hover:border-teal"
          >
            <IconShuffle size={12} aria-hidden="true" />
            Coba {suggestion.region.label} ({suggestion.count})
            <span
              aria-hidden="true"
              className="transition-transform duration-500 ease-cine group-hover:translate-x-1"
            >
              →
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
