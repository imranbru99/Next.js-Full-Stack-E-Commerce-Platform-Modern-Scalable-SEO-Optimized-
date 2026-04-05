import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import ShippingContent from "./ShippingContent";

export default function ShippingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <ShippingContent />
      </main>
      <Footer />
    </>
  );
}