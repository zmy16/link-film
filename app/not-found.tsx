import type { Metadata } from "next";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Aurora, ScrollReveal } from "@/components/motion/MotionFx";
import { GradientText, SplitText } from "@/components/motion/MotionText";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan — Golden Movie Hub",
  description:
    "Halaman yang kamu cari tidak ada di direktori Golden Movie Hub. Kembali ke beranda untuk melihat semua situs streaming.",
  alternates: {
    canonical: "/404",
  },
  openGraph: {
    title: "Halaman tidak ditemukan — Golden Movie Hub",
    description:
      "Halaman yang kamu cari tidak ada di direktori Golden Movie Hub.",
    type: "website",
    locale: "id_ID",
  },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <section className="grain relative isolate flex flex-1 items-center overflow-hidden">
        <Aurora />

        <ScrollReveal className="relative mx-auto w-full max-w-[1120px] px-5 py-20 sm:px-8">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
              Error 404
            </span>
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
          </div>

          <h1 className="mt-7 font-display text-[76px] font-extrabold leading-[0.88] tracking-[-0.05em]">
            <GradientText>404</GradientText>
          </h1>

          <p className="mt-7 max-w-[42ch] font-display text-[19px] font-bold leading-snug tracking-tight text-ink sm:text-[23px]">
            <SplitText text="Halaman ini tidak ada di direktori." delay={0.15} />
          </p>

          <p className="mt-3 max-w-[50ch] text-[13px] leading-relaxed text-muted">
            Mungkin tautannya salah ketik atau sudah dipindahkan. Kembali ke
            beranda untuk melihat semua situs streaming yang tersedia.
          </p>

          <a
            href="/"
            className="mt-8 inline-flex items-center gap-2 border-b border-gold/50 pb-1 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-gold transition-colors duration-300 hover:border-gold"
          >
            ← Kembali ke Beranda
          </a>
        </ScrollReveal>
      </section>
      <Footer />
    </main>
  );
}
