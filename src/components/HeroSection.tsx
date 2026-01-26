import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToAbout = () => {
    const element = document.querySelector("#about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-burgundy-light">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-accent blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-rose blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        </div>

        {/* Image placeholder overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-primary-foreground/30 text-center">
            <div className="w-64 h-64 md:w-96 md:h-96 border-2 border-dashed border-primary-foreground/20 rounded-full flex items-center justify-center">
              <span className="font-body text-sm uppercase tracking-widest">Hero Image</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <p className="font-body text-sm md:text-base uppercase tracking-[0.3em] text-accent mb-6 animate-fade-up">
          Stand-Up Comedian
        </p>
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-primary-foreground mb-6 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          CATHERINE GELLER
        </h1>
        <p className="font-body text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.4s" }}>
          Making audiences laugh one punchline at a time. Raw, honest, and unapologetically hilarious.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.6s" }}>
          <Button
            variant="secondary"
            size="lg"
            className="font-body uppercase tracking-widest px-8 py-6 text-sm hover:bg-accent hover:text-accent-foreground transition-all"
            onClick={() => document.querySelector("#tour")?.scrollIntoView({ behavior: "smooth" })}
          >
            See Tour Dates
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="font-body uppercase tracking-widest px-8 py-6 text-sm border-champagne/50 text-champagne bg-champagne/10 hover:bg-champagne/20 transition-all"
            onClick={() => document.querySelector("#watch")?.scrollIntoView({ behavior: "smooth" })}
          >
            Watch Clips
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary-foreground/60 hover:text-accent transition-colors animate-bounce"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
};

export default HeroSection;
