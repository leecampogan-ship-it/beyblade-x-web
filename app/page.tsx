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

export default function Home() {
  return (
    <>
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
