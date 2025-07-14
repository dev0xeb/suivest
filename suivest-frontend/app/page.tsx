import Navbar from "./components/Home/Navbar";
import HeroSection from "./components/Home/HeroSection";
import StatsBar from "./components/Home/StatsBar";
import Features from "./components/Home/Features";
import WhySuivest from "./components/Home/WhySuivest";
import Footer from "./components/Home/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />
      <main className="flex-1 flex flex-col gap-0 items-center w-full">
        <HeroSection />
        <StatsBar />
        <Features />
        <WhySuivest />
      </main>
      <Footer />
    </div>
  );
}
