import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import ContactClient from "./ContactClient";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <ContactClient />
      </main>
      <Footer />
    </>
  );
}