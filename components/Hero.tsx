import { REGIONS, TOTAL_PROVIDERS } from "@/lib/providers";
import { Aurora } from "./motion/MotionFx";
import { CountUp, GradientText, SplitText } from "./motion/MotionText";

const stats = [
  { label: "Provider", to: TOTAL_PROVIDERS, duration: 1.4, tone: "text-gold" },
  { label: "Region", to: REGIONS.length, duration: 1, tone: "text-teal" },
];

export default function Hero() {
  return (
    <section className="grain relative isolate overflow-hidden">
      <Aurora />

      <div className="relative mx-auto max-w-[1120px] px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
        <h1 className="font-display text-[38px] font-extrabold leading-[1.02] tracking-[-0.038em] text-ink sm:text-[58px] md:text-[72px]">
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
