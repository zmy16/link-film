import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
      </body>
    </html>
  );
}
