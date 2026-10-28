import { REGIONS, TOTAL_PROVIDERS } from "@/lib/providers";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-base">
      <div className="mx-auto max-w-[1120px] px-5 py-10 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Logo size={28} />
            <div>
              <a
                href="/"
                className="font-display text-[13px] font-bold tracking-tight text-ink transition-colors duration-300 hover:text-gold"
              >
                Golden Movie Hub
              </a>
              <p className="mt-1.5 max-w-[44ch] text-[11.5px] leading-relaxed text-muted">
                Direktori tautan. Seluruh konten berada di situs masing-masing
                provider, bukan di sini.
              </p>
            </div>
          </div>

          <dl className="flex items-stretch divide-x divide-line">
            <div className="pr-6">
              <dd className="font-display text-[15px] font-extrabold tabular-nums text-gold">
                {String(TOTAL_PROVIDERS).padStart(2, "0")}
              </dd>
              <dt className="mt-1.5 text-[9px] uppercase tracking-[0.22em] text-muted">
                Situs
              </dt>
            </div>
            <div className="px-6">
              <dd className="font-display text-[15px] font-extrabold tabular-nums text-teal">
                {String(REGIONS.length).padStart(2, "0")}
              </dd>
              <dt className="mt-1.5 text-[9px] uppercase tracking-[0.22em] text-muted">
                Region
              </dt>
            </div>
            <div className="pl-6">
              <dd className="font-display text-[15px] font-extrabold tabular-nums text-ink">
                {new Date().getFullYear()}
              </dd>
              <dt className="mt-1.5 text-[9px] uppercase tracking-[0.22em] text-muted">
                Tahun
              </dt>
            </div>
          </dl>
        </div>
      </div>
    </footer>
  );
}
