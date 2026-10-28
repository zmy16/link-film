import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProviderDirectory from "@/components/ProviderDirectory";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Hero />
      <div className="flex-1">
        <ProviderDirectory />
      </div>
      <Footer />
    </main>
  );
}
