import Navbar from "@/components/Navbar";
import StoryHero from "@/components/StoryHero";
import History from "@/components/History";
import AboutBeybladeX from "@/components/AboutBeybladeX";
import PartsBreakdown from "@/components/PartsBreakdown";
import BeybladeTypes from "@/components/BeybladeTypes";
import Stadium from "@/components/Stadium";
import Collection from "@/components/Collection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import LoadingScreen from "@/components/LoadingScreen";
import { PRODUCTS } from "@/lib/products";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Structured data for search engines: the site itself plus the Beyblades in the collection.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: "An independent, interactive 3D educational fan guide to Beyblade X.",
    },
    {
      "@type": "ItemList",
      name: "Beyblade X collection",
      url: `${SITE_URL}/#collection`,
      numberOfItems: PRODUCTS.length,
      itemListElement: PRODUCTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${p.name} ${p.config}`,
        description: p.description,
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <LoadingScreen />
      <Navbar />
      <main id="main">
        <StoryHero />
        <History />
        <AboutBeybladeX />
        <PartsBreakdown />
        <BeybladeTypes />
        <Stadium />
        <Collection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
