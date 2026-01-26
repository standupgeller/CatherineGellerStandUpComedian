import { Link } from "react-router-dom";

const eras = [
  {
    id: "era-2024",
    title: "Unfiltered Era",
    year: "2024",
    description: "Netflix Special & National Tour",
    slug: "unfiltered-2024",
  },
  {
    id: "era-2023",
    title: "Podcast Era",
    year: "2023",
    description: "The Laugh Track Launch",
    slug: "podcast-2023",
  },
  {
    id: "era-2022",
    title: "Rising Star Era",
    year: "2022",
    description: "Comedy Central Debut",
    slug: "rising-star-2022",
  },
  {
    id: "era-2021",
    title: "Club Days Era",
    year: "2021",
    description: "Building the Foundation",
    slug: "club-days-2021",
  },
  {
    id: "era-2020",
    title: "Virtual Era",
    year: "2020",
    description: "Live from the Living Room",
    slug: "virtual-2020",
  },
  {
    id: "era-2019",
    title: "The Beginning",
    year: "2019",
    description: "First Open Mic",
    slug: "beginning-2019",
  },
];

const ArchiveSection = () => {
  return (
    <section id="archive" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-accent mb-4">
            Through The Years
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
            Archive
          </h2>
          <p className="font-body text-foreground/60 max-w-xl mx-auto">
            Explore the different eras and milestones of Catherine's comedy journey.
          </p>
        </div>

        {/* Eras Grid - Taylor Swift inspired */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {eras.map((era) => (
            <Link
              key={era.id}
              to={`/archive/${era.slug}`}
              className="group relative aspect-square overflow-hidden rounded-xl hover-lift cursor-pointer"
            >
              {/* Background placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-rose/20">
                <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-border">
                  <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">
                    Era Image
                  </span>
                </div>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Content */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <span className="font-body text-xs uppercase tracking-[0.3em] text-accent mb-2">
                  {era.year}
                </span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-background mb-2 group-hover:text-accent transition-colors">
                  {era.title}
                </h3>
                <p className="font-body text-sm text-background/80">
                  {era.description}
                </p>

                {/* Explore indicator */}
                <div className="mt-4 flex items-center gap-2 text-accent opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                  <span className="font-body text-xs uppercase tracking-widest">
                    Explore
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArchiveSection;
