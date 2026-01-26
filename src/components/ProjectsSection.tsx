import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLandingPage } from "@/context/LandingPageContext";

const ProjectsSection = () => {
  const { projects } = useLandingPage();

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
          {projects.length > 0 ? (
            projects.map((project) => (
            <div
              key={project.id}
              className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500"
            >
              <div className="grid md:grid-cols-[1fr,2fr] gap-0">
                {/* Image placeholder */}
                <div className="aspect-video md:aspect-square bg-primary/10 relative overflow-hidden">
                  {project.image_url ? (
                     <img 
                       src={project.image_url} 
                       alt={project.title} 
                       className="w-full h-full object-cover"
                     />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-border">
                        <span className="font-body text-sm uppercase tracking-widest text-muted-foreground">
                        Project Image
                        </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="w-12 h-12 text-primary-foreground" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-body text-xs uppercase tracking-widest px-3 py-1 bg-accent/20 text-accent rounded-full">
                      {project.category || 'Project'}
                    </span>
                    <span className="font-body text-sm text-muted-foreground">
                      {new Date(project.created_at).getFullYear()}
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
                    asChild
                  >
                    <a href={project.link_url || '#'} target="_blank" rel="noopener noreferrer">
                        {project.link_text || 'Learn More'}
                        <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))
          ) : (
             <div className="text-center text-muted-foreground">No projects found.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
