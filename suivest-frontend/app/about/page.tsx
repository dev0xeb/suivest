import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import AboutHero from "../components/about/AboutHero";
import AboutMission from "../components/about/AboutMission";
import AboutWhySuivestGrid from "../components/about/AboutWhySuivestGrid";
import AboutWhySuivestText from "../components/about/AboutWhySuivestText";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />
      <main className="flex-1 flex flex-col gap-0 items-center w-full">
        <AboutHero />
        <AboutMission />
        <AboutWhySuivestGrid />
        <AboutWhySuivestText />
      </main>
      <Footer />
    </div>
  );
} 