import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import TermsContent from "./HomeContent";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <TermsContent />
      </main>
      <Footer />
    </>
  );
}