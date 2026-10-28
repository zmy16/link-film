import Logo from "./Logo";
import ScrollProgress from "./ScrollProgress";

export default function Header() {
  return (
    // Opaque below `sm` on purpose: these two bars are sticky, so a blurred or
    // translucent fill means re-blurring / blending the content behind them on
    // every scrolled frame — the expensive part on a phone — and at 95% the
    // headline ghosted through the header. Solid is cheaper and reads cleaner;
    // the frosted look returns from `sm` up.
    <header className="sticky top-0 z-40 border-b border-line/70 bg-base sm:bg-base/85 sm:backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center px-5 sm:px-8">
        <a
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-lg"
          aria-label="Golden Movie Hub — beranda"
        >
          <span className="shrink-0">
            <Logo size={32} />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-display text-[15px] font-bold leading-none tracking-tight text-ink">
              Golden Movie Hub
            </span>
            <span className="mt-1 truncate text-[10.5px] leading-none text-muted">
              Direktori situs streaming
            </span>
          </span>
        </a>
      </div>

      <ScrollProgress />
    </header>
  );
}
