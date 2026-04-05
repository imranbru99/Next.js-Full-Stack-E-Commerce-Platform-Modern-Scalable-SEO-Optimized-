import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import RefundContent from "./RefundContent";

export default function RefundPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <RefundContent />
      </main>
      <Footer />
    </>
  );
}