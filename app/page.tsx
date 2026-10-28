import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProviderDirectory from "@/components/ProviderDirectory";
import Footer from "@/components/Footer";
import { resolveLiveUrls } from "@/lib/live-link";
import { REGIONS } from "@/lib/providers";

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
      <Header />
      <Hero />
      <div className="flex-1">
        <ProviderDirectory liveUrls={liveUrls} />
      </div>
      <Footer />
    </main>
  );
}
