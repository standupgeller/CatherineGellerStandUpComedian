import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLandingPage } from "@/context/LandingPageContext";
import { motion, useScroll, useTransform } from "framer-motion";

const HeroSection = () => {
  const { siteSettings, aboutSection } = useLandingPage();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const textY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const scrollToAbout = () => {
    const element = document.querySelector("#about");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const heroTitle = siteSettings?.hero_title || "CATHERINE GELLER";
  const siteTagline = siteSettings?.site_tagline || "Stand-Up Comedian";
  const backgroundGradient = siteSettings?.hero_background_gradient || "from-secondary via-secondary to-secondary/30";
  const heroBgImage = siteSettings?.hero_background_image_url || "";
  const splitTitle = heroTitle.trim().split(/\s+/);
  const firstLine = splitTitle.length > 1 ? splitTitle.slice(0, -1).join(" ") : heroTitle;
  const lastWord = splitTitle.length > 1 ? splitTitle[splitTitle.length - 1] : "";
  const rawContent = aboutSection?.content?.trim() ?? "";
  let paragraphs: string[] = [];
  if (rawContent) {
    const byLines = rawContent.split("\n").map(p => p.trim()).filter(p => p.length > 0);
    if (byLines.length > 1) {
      paragraphs = byLines;
    } else if (rawContent.includes("With sharp logic")) {
      const idx = rawContent.indexOf("With sharp logic");
      const before = rawContent.slice(0, idx).trim();
      const after = rawContent.slice(idx).trim();
      if (before) paragraphs.push(before);
      if (after) paragraphs.push(after);
    } else {
      paragraphs = [rawContent];
    }
  }

  return (
    <section
      id="hero"
      ref={ref}
      className="relative min-h-screen flex items-center py-20 overflow-hidden"
    >
      {/* Background with Parallax */}
      {heroBgImage && (
        <motion.div
          className="absolute -top-[15%] left-0 w-full h-[130%] bg-cover bg-no-repeat bg-[80%_center] z-0"
          style={{
            backgroundImage: `url(${heroBgImage})`,
            y: bgY
          }}
        />
      )}
      
      {/* Background Decorative elements removed to ensure clean background */}
      
      <div className="container mx-auto px-6 h-full relative z-10">
        <div className="grid lg:grid-cols-1 gap-8 items-start h-full">
          
          {/* Left Column: Content */}
          <motion.div 
            style={{ y: textY }}
            className="text-left mt-20 md:mt-24 lg:mt-28"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
            }}
          >
            <motion.h1 
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4"
            >
              <span>{firstLine}</span>
              {lastWord && (
                <>
                  <br />
                  <span>{lastWord}</span>
                </>
              )}
            </motion.h1>
            <motion.p 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="font-body text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] text-white mb-4"
            >
              {siteTagline}
            </motion.p>
            
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button
                variant="gradient"
                size="lg"
                className="font-body uppercase tracking-widest px-6 py-4 sm:px-8 sm:py-6 text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                onClick={() => document.querySelector("#tour")?.scrollIntoView({ behavior: "smooth" })}
              >
                See Tour Dates
              </Button>
              <Button
                variant="gradient"
                size="lg"
                className="font-body uppercase tracking-widest px-6 py-4 sm:px-8 sm:py-6 text-xs sm:text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Book Now
              </Button>
            </motion.div>
            <div id="about" className="space-y-3 sm:space-y-4 font-body leading-normal mt-16 sm:mt-20 text-justify w-full sm:w-[95%] md:w-[90%] lg:w-full lg:max-w-[40vw]">
              {paragraphs.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  {paragraphs.map((paragraph, i) => (
                    <p key={i} className="text-white text-sm sm:text-base md:text-lg lg:text-xl">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
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
