import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProviderDirectory from "@/components/ProviderDirectory";
import Footer from "@/components/Footer";
import { resolveLiveUrls } from "@/lib/live-link";
import { REGIONS, TOTAL_PROVIDERS } from "@/lib/providers";

const SITE = "https://www.link-film.eu.org";

/**
 * Structured data for search engines. Without it Google sees a list of names in
 * a grid and has to guess what the page is; with it the page is a typed
 * ItemList of external sites, which is what it actually is.
 * Rendered server-side, so no client JS is needed to emit it.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      "url": SITE,
      "name": "Golden Movie Hub",
      "inLanguage": "id-ID",
      "description":
        "Direktori situs streaming film & series Indonesia dan luar negeri dengan subtitle Bahasa Indonesia.",
    },
    {
      "@type": "ItemList",
      "name": "Situs streaming film & series",
      "numberOfItems": TOTAL_PROVIDERS,
      "itemListElement": REGIONS.flatMap((region) =>
        region.items.map((provider, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: provider.name,
          description: provider.tagline,
        })),
      ),
    },
  ],
};

/**
 * Providers whose domain rotates publish a "domain info" page instead of a
 * fixed address. Reading it here — on the server, at most once per revalidate
 * window — lets each card link straight at the site that works today, so a
 * visitor clicks once instead of clicking through an interstitial.
 */
export const revalidate = 900;

export default async function HomePage() {
  const liveUrls = await resolveLiveUrls(
    REGIONS.flatMap((region) => region.items.map((provider) => provider.id)),
  );

  return (
    <main className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        // Server-built constant, never user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Hero />
      <div className="flex-1">
        <ProviderDirectory liveUrls={liveUrls} />
      </div>
      <Footer />
    </main>
  );
}
