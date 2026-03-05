import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Benefits from "@/components/landing/Benefits";
import Process from "@/components/landing/Process";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Spacer so content is not hidden under fixed navbar (navbar h-[72px]) */}
      <div className="pt-[72px]">
        <Hero />
      <Benefits />
      <Process />
      <Pricing />
      <FAQ />
      <Footer />
      </div>
    </div>
  );
};

export default Index;
