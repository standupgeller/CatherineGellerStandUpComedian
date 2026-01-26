const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image placeholder */}
          <div className="relative order-2 md:order-1">
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden shadow-elevated">
              <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-border">
                <span className="font-body text-sm uppercase tracking-widest text-muted-foreground">
                  Portrait Image
                </span>
              </div>
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-accent rounded-lg -z-10" />
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <p className="font-body text-sm uppercase tracking-[0.3em] text-accent mb-4">
              About
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-8">
              The Woman Behind the Mic
            </h2>
            <div className="space-y-6 font-body text-foreground/80 leading-relaxed">
              <p>
                Catherine Geller has been making audiences roar with laughter for over a decade.
                Known for her sharp wit, relatable storytelling, and fearless approach to
                comedy, she's become one of the most sought-after performers in the industry.
              </p>
              <p>
                From sold-out theater tours to Netflix specials, Catherine brings her unique
                perspective on life, relationships, and the absurdity of everyday existence
                to stages around the world.
              </p>
              <p>
                When she's not on stage, you can find her writing new material, hosting
                her hit podcast, or spending time with her rescue dogs.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-border">
              <div>
                <p className="font-display text-4xl md:text-5xl font-bold text-primary">10+</p>
                <p className="font-body text-sm uppercase tracking-widest text-muted-foreground mt-2">Years</p>
              </div>
              <div>
                <p className="font-display text-4xl md:text-5xl font-bold text-primary">500+</p>
                <p className="font-body text-sm uppercase tracking-widest text-muted-foreground mt-2">Shows</p>
              </div>
              <div>
                <p className="font-display text-4xl md:text-5xl font-bold text-primary">1M+</p>
                <p className="font-body text-sm uppercase tracking-widest text-muted-foreground mt-2">Fans</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
