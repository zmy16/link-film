import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Only the weights this UI actually asks for. Sora is used exclusively with
// font-bold / font-extrabold and Inter with 400 / 600 / 700 — the extra
// weights were downloaded and preloaded on every visit to render nothing.
const sora = Sora({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.link-film.eu.org"),
  title: "Golden Movie Hub — Direktori Situs Streaming Film & Series",
  description:
    "Kumpulan situs streaming film & series Indonesia maupun luar negeri dengan subtitle Bahasa Indonesia. Pilih provider, langsung tonton.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Golden Movie Hub — Direktori Situs Streaming",
    description:
      "Kumpulan situs streaming film & series Indonesia maupun luar negeri dengan subtitle Bahasa Indonesia.",
    url: "https://www.link-film.eu.org",
    siteName: "Golden Movie Hub",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Golden Movie Hub — Direktori Situs Streaming",
    description:
      "Kumpulan situs streaming film & series Indonesia maupun luar negeri dengan subtitle Bahasa Indonesia.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#08080A",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${sora.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-base font-sans text-ink antialiased">
        {children}
        <Analytics />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="a45ea7e2-7aa2-4bde-baf9-ce744d07d8aa"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
