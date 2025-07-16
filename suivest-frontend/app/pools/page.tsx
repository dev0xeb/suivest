import Footer from "../components/Home/Footer";
import Navbar from "../components/Home/Navbar";
import PoolShowcase from "../components/Pools/PoolShowcase";

export default function PoolsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />
      <main className="flex-1 flex flex-col gap-0 items-center w-full">
        <PoolShowcase />
      </main>
      <Footer />
    </div>
  );
}
