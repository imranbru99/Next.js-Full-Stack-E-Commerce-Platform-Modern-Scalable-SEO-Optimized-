import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { SettingsProvider } from "@/components/SettingsContext";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <div className="min-h-screen flex flex-col bg-white">
        {/* The Header handles its own data fetching/caching */}
        <Header />
        
        <main className="flex-grow">
          {children}
        </main>

        {/* The Footer handles its own data fetching/caching */}
        <Footer />
      </div>
    </SettingsProvider>
  );
}