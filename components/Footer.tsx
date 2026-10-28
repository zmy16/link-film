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

          <p className="shrink-0 pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted tabular-nums">
            &copy; {new Date().getFullYear()} Golden Movie Hub
          </p>
        </div>
      </div>
    </footer>
  );
}
