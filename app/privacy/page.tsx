import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import PrivacyContent from "./PrivacyContent";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <PrivacyContent />
      </main>
      <Footer />
    </>
  );
}