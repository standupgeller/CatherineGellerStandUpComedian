import { ArrowRight } from "lucide-react";
import { useLandingPage } from "@/context/LandingPageContext";
import AnimatedSection from "./AnimatedSection";

const ArchiveSection = () => {
  const { archiveCategories } = useLandingPage();

  return (
    <AnimatedSection id="archive" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-accent mb-4">
            Through The Years
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-tr from-[#1A2972] via-[#611991] to-[#3F00FF] bg-clip-text text-transparent mb-4">
            Archive
          </h2>
          <p className="font-body text-foreground/60 max-w-xl mx-auto">
            Explore the different eras and milestones of Catherine's comedy journey.
          </p>
        </div>

        {/* Eras Grid - Taylor Swift inspired */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {archiveCategories.length > 0 ? (
            archiveCategories.map((era) => (
            <a
              key={era.id}
              href={era.link_url || '#'}
              target={era.link_url ? "_blank" : undefined}
              rel={era.link_url ? "noopener noreferrer" : undefined}
              className={`group relative aspect-square overflow-hidden rounded-xl hover-lift ${era.link_url ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              {/* Background placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-rose/20">
                {era.cover_image_url ? (
                    <img 
                        src={era.cover_image_url} 
                        alt={era.title} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-border">
                        <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">
                            Era Image
                        </span>
                    </div>
                )}
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                {era.year && (
                  <span className="font-body text-xs uppercase tracking-[0.3em] text-white mb-2">
                    {era.year}
                  </span>
                )}
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2 transform group-hover:scale-105 transition-transform duration-300 origin-left">
                  {era.title}
                </h3>
                <p className="font-body text-sm text-white/90">
                  {era.description}
                </p>

                {/* Explore indicator */}
                <div className="mt-4 flex items-center gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                  <span className="font-body text-xs uppercase tracking-widest">
                    Explore
                  </span>
                  <ArrowRight className="w-4 h-4 transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-300 delay-100" />
                </div>
              </div>
            </a>
          ))
          ) : (
              <div className="text-center text-muted-foreground col-span-full">No archives found.</div>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ArchiveSection;
