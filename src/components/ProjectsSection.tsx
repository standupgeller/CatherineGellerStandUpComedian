import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    title: "Netflix Special: Unfiltered",
    year: "2024",
    description: "Jane's debut Netflix special where she tackles everything from dating apps to family dynamics with her signature style.",
    type: "Special",
  },
  {
    id: 2,
    title: "The Laugh Track Podcast",
    year: "2023 - Present",
    description: "Weekly conversations with fellow comedians, celebrities, and interesting people from all walks of life.",
    type: "Podcast",
  },
  {
    id: 3,
    title: "Comedy Central Presents",
    year: "2022",
    description: "A half-hour special that put Jane on the map as one of comedy's rising stars.",
    type: "Special",
  },
];

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 md:py-32 bg-muted/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-accent mb-4">
            Featured Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
            Projects
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500"
            >
              <div className="grid md:grid-cols-[1fr,2fr] gap-0">
                {/* Image placeholder */}
                <div className="aspect-video md:aspect-square bg-primary/10 relative overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-border">
                    <span className="font-body text-sm uppercase tracking-widest text-muted-foreground">
                      Project Image
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="w-12 h-12 text-primary-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-body text-xs uppercase tracking-widest px-3 py-1 bg-accent/20 text-accent rounded-full">
                      {project.type}
                    </span>
                    <span className="font-body text-sm text-muted-foreground">
                      {project.year}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="font-body text-foreground/70 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-fit font-body uppercase tracking-widest text-sm border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Learn More
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
