"use client";

import { IconClose, IconSearch } from "./Icons";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  maxLength: number;
};

export default function SearchBar({
  value,
  onChange,
  onClear,
  maxLength,
}: SearchBarProps) {
  return (
    <div className="relative w-full md:max-w-[300px]">
      <IconSearch
        size={15}
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        type="search"
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") onClear();
        }}
        placeholder="Cari situs, genre, region…"
        aria-label="Cari provider streaming"
        className="h-10 w-full rounded-lg border border-line bg-surface pl-10 pr-10 text-[13px] text-ink transition-colors duration-300 placeholder:text-muted focus:border-gold/60 focus:bg-elevated focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Hapus pencarian"
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-ink"
        >
          <IconClose size={12} />
        </button>
      )}
    </div>
  );
}
