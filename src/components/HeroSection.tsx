import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLandingPage } from "@/context/LandingPageContext";
import { motion, useScroll, useTransform } from "framer-motion";

const HeroSection = () => {
  const { siteSettings } = useLandingPage();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const scrollToAbout = () => {
    const element = document.querySelector("#about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const heroTitle = siteSettings?.hero_title || "CATHERINE GELLER";
  const heroSubtitle = siteSettings?.hero_subtitle || "Making audiences laugh one punchline at a time. Raw, honest, and unapologetically hilarious.";
  const siteTagline = siteSettings?.site_tagline || "Stand-Up Comedian";
  const backgroundGradient = siteSettings?.hero_background_gradient || "from-secondary via-secondary to-secondary/30";

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center bg-secondary py-20 overflow-hidden"
    >
      {/* Background Decorative elements removed to ensure clean background */}
      
      <div className="container mx-auto px-6 h-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center h-full">
          
          {/* Left Column: Content */}
          <motion.div 
            style={{ y: textY }}
            className="text-left order-2 lg:order-1"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.h1 
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-tr from-[#1A2972] via-[#611991] to-[#3F00FF] bg-clip-text text-transparent mb-6"
            >
              {heroTitle}
            </motion.h1>
            <motion.p 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="font-body text-sm md:text-base uppercase tracking-[0.3em] text-black mb-6"
            >
              {siteTagline}
            </motion.p>
            <motion.p 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="font-body text-lg md:text-xl text-foreground/80 max-w-xl mb-10"
            >
              {heroSubtitle}
            </motion.p>
            
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                variant="gradient"
                size="lg"
                className="font-body uppercase tracking-widest px-8 py-6 text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                onClick={() => document.querySelector("#tour")?.scrollIntoView({ behavior: "smooth" })}
              >
                See Tour Dates
              </Button>
              <Button
                variant="gradient"
                size="lg"
                className="font-body uppercase tracking-widest px-8 py-6 text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                onClick={() => document.querySelector("#watch")?.scrollIntoView({ behavior: "smooth" })}
              >
                Watch Clips &gt;
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column: Image */}
          <motion.div 
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative order-1 lg:order-2 w-full flex justify-center lg:justify-end"
          >
            {siteSettings?.hero_image_url ? (
              <div className="w-full max-w-xl aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                 <img 
                  src={siteSettings.hero_image_url} 
                  alt="Hero" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full max-w-xl aspect-square rounded-[2.5rem] border-2 border-dashed border-primary/10 flex items-center justify-center bg-white/50">
                <span className="font-body text-sm uppercase tracking-widest text-primary/40">Hero Image</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-primary/40 hover:text-primary transition-colors animate-bounce"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
};

export default HeroSection;
