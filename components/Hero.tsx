import { REGIONS, TOTAL_PROVIDERS } from "@/lib/providers";
import { Aurora } from "./motion/MotionFx";
import { CountUp, GradientText, ShinyText, SplitText } from "./motion/MotionText";

const stats = [
  { label: "Provider", to: TOTAL_PROVIDERS, duration: 1.4, tone: "text-gold" },
  { label: "Region", to: REGIONS.length, duration: 1, tone: "text-teal" },
];

export default function Hero() {
  return (
    <section className="grain relative isolate overflow-hidden">
      <Aurora />

      <div className="relative mx-auto max-w-[1120px] px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3 py-1.5">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-gold"
            />
            <ShinyText
              speed={5.5}
              className="text-[10px] font-semibold uppercase tracking-[0.2em]"
            >
              Kurasi manual, tanpa iklan pop-up
            </ShinyText>
          </span>
          <span className="hidden h-px flex-1 bg-line sm:block" aria-hidden="true" />
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted sm:block">
            {TOTAL_PROVIDERS} situs · {REGIONS.length} region
          </span>
        </div>

        <h1 className="mt-7 font-display text-[38px] font-extrabold leading-[1.02] tracking-[-0.038em] text-ink sm:text-[58px] md:text-[72px]">
          <span className="block">
            <SplitText text="Nonton film," stagger={0.022} />
          </span>
          <span className="block">
            <GradientText delay={0.26} className="pb-[0.06em]">
              tanpa ribet cari link.
            </GradientText>
          </span>
        </h1>

        <div className="mt-10 flex flex-col gap-8 border-t border-line pt-7 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[52ch] text-[13.5px] leading-relaxed text-ink-soft sm:text-[15px]">
            Golden Movie Hub merangkum situs streaming film &amp; series —
            produksi Indonesia sampai box office internasional — dalam satu
            direktori yang rapi. Pilih provider, langsung tonton.
          </p>

          <dl className="flex shrink-0 items-stretch divide-x divide-line">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={index === 0 ? "pr-7" : "px-7"}
              >
                <dd
                  className={`font-display text-[26px] font-extrabold leading-none tracking-tight tabular-nums ${stat.tone}`}
                >
                  <CountUp to={stat.to} duration={stat.duration} />
                </dd>
                <dt className="mt-2 text-[9.5px] font-semibold uppercase tracking-[0.24em] text-muted">
                  {stat.label}
                </dt>
              </div>
            ))}
            <div className="pl-7">
              <dd className="font-display text-[26px] font-extrabold leading-none tracking-tight text-ink">
                ID
              </dd>
              <dt className="mt-2 text-[9.5px] font-semibold uppercase tracking-[0.24em] text-muted">
                Subtitle
              </dt>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
