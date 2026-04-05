import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import SearchContent from "./SearchContent";

// In Next.js 15+, searchParams is a Promise
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams; // Wait for the params to resolve

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Pass the query "q" down to the child component */}
        <SearchContent query={q || ""} />
      </main>
      <Footer />
    </>
  );
}