import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import WatchSection from "@/components/WatchSection";
import TourSection from "@/components/TourSection";
import ArchiveSection from "@/components/ArchiveSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { LandingPageProvider, useLandingPage } from "@/context/LandingPageContext";

const LandingPageContent = () => {
  const { loading } = useLandingPage();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-fade-in">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <WatchSection />
      <TourSection />
      <ArchiveSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

const Index = () => {
  return (
    <LandingPageProvider>
      <LandingPageContent />
    </LandingPageProvider>
  );
};

export default Index;
