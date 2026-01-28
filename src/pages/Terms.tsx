import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLandingPage } from "@/context/LandingPageContext";
import AnimatedSection from "@/components/AnimatedSection";

const Terms = () => {
  const { siteSettings, loading } = useLandingPage();
  const content = siteSettings?.terms_of_service || "Terms of Service content coming soon.";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-32">
        <AnimatedSection>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-8 text-black">
            Terms of Service
          </h1>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
            </div>
          ) : (
            <div className="prose max-w-none font-body text-foreground/80 whitespace-pre-wrap">
              {content}
            </div>
          )}
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
