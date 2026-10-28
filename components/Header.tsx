import { TOTAL_PROVIDERS } from "@/lib/providers";
import Logo from "./Logo";
import { Magnet } from "./motion/MotionFx";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-base/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-4 px-5 sm:px-8">
        <a
          href="/"
          className="group flex min-w-0 items-center gap-3 rounded-lg"
          aria-label="Golden Movie Hub — beranda"
        >
          <Magnet strength={0.18} radius={46}>
            <Logo size={32} />
          </Magnet>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="truncate font-display text-[15px] font-bold tracking-tight text-ink">
              Golden Movie Hub
            </span>
            <span className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.3em] text-muted">
              Direktori Streaming
            </span>
          </span>
        </a>

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted sm:inline">
            {String(TOTAL_PROVIDERS).padStart(2, "0")} situs
          </span>
          <span
            className="hidden h-3 w-px bg-line sm:block"
            aria-hidden="true"
          />
          <span className="inline-flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full bg-teal"
              aria-hidden="true"
            />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Live
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
