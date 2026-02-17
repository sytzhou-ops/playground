import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import BountiesSection from "@/components/BountiesSection";
import CategoriesSection from "@/components/CategoriesSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh noise-overlay">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <BountiesSection />
      <CategoriesSection />
      <CTASection />
    </div>
  );
};

export default Index;
