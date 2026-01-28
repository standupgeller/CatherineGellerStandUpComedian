import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLandingPage } from "@/context/LandingPageContext";
import AnimatedSection from "./AnimatedSection";

const ProjectsSection = () => {
  const { projects } = useLandingPage();

  return (
    <AnimatedSection id="projects" className="py-24 md:py-32 bg-muted/50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-accent mb-4">
            Featured Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-tr from-[#1A2972] via-[#611991] to-[#3F00FF] bg-clip-text text-transparent">
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
                </div>

                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="font-body text-xs uppercase tracking-widest px-3 py-1 bg-gradient-to-tr from-[#1A2972] via-[#611991] to-[#3F00FF] text-white rounded-full">
                      {project.category || 'Project'}
                    </span>
                    <span className="font-body text-sm text-muted-foreground">
                      {new Date(project.created_at).getFullYear()}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-black mb-4">
                    {project.title}
                  </h3>
                  <p className="font-body text-foreground/70 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  <Button
                    variant="outline"
                    className="w-fit font-body uppercase tracking-widest text-sm border-primary text-primary hover:text-white hover:border-transparent hover:bg-gradient-to-tr hover:from-[#1A2972] hover:via-[#611991] hover:to-[#3F00FF] transition-all"
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
    </AnimatedSection>
  );
};

export default ProjectsSection;
