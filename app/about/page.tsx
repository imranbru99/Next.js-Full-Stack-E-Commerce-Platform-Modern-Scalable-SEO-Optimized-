import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import AboutContent from "./AboutContent"; // We move the "use client" logic here

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}