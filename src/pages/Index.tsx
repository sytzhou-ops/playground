import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import BountiesSection from "@/components/BountiesSection";
import CategoriesSection from "@/components/CategoriesSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
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
