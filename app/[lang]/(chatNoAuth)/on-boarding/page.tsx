import { Header } from "@/components/on-boarding/Header";
import { Hero3D } from "@/components/on-boarding/Hero3D";
import { AboutSection } from "@/components/on-boarding/AboutSection";
import { FeaturesSection } from "@/components/on-boarding/FeaturesSection";
import { HowItWorksSection } from "@/components/on-boarding/HowItWorksSection";
import { CTASection } from "@/components/on-boarding/CTASection";

export default function OnBoardingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className=""> {/* Add padding-top to account for fixed header */}
        <Hero3D />
        <AboutSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </main>
    </div>
  );
}
