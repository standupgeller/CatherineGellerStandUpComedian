import { Play } from "lucide-react";
import { useLandingPage } from "@/context/LandingPageContext";
import { Database } from "@/integrations/supabase/types";
import AnimatedSection from "./AnimatedSection";

type Video = Database['public']['Tables']['videos']['Row'];

const WatchSection = () => {
  const { videos } = useLandingPage();

  const featuredVideo = videos.find(v => v.is_featured) || videos[0];
  const gridVideos = videos.filter(v => v.id !== featuredVideo?.id);

  const getThumbnail = (video: Video) => {
      if (video.thumbnail_url) return video.thumbnail_url;
      if (video.youtube_embed_id) return `https://img.youtube.com/vi/${video.youtube_embed_id}/maxresdefault.jpg`;
      return null;
  };

  return (
    <AnimatedSection id="watch" className="py-24 md:py-32 bg-background text-foreground">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-black mb-4">
            Clips & Highlights
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-black">
            Watch
          </h2>
        </div>

        {/* Featured Video */}
        {featuredVideo && (
        <div className="mb-12">
          <a 
            href={featuredVideo.youtube_url || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block relative aspect-video bg-foreground/10 rounded-xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            {getThumbnail(featuredVideo) ? (
                 <img 
                    src={getThumbnail(featuredVideo)!} 
                    alt={featuredVideo.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                 />
            ) : (
                <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-primary-foreground/20">
                <span className="font-body text-sm uppercase tracking-widest text-primary-foreground/50">
                    Featured Video
                </span>
                </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-[#1A2972] via-[#611991] to-[#3F00FF] flex items-center justify-center group-hover:scale-110 transition-transform shadow-gold">
                <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" />
              </div>
            </div>
          </a>
          <h3 className="font-display text-2xl font-bold mt-4 text-center text-black">{featuredVideo.title}</h3>
        </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {gridVideos.map((video) => (
            <a
              key={video.id}
              href={video.youtube_url || '#'}
              target="_blank" 
              rel="noopener noreferrer"
              className="group cursor-pointer"
            >
              <div className="relative aspect-video bg-foreground/10 rounded-lg overflow-hidden mb-4 shadow-lg hover:shadow-xl transition-all duration-300">
                {getThumbnail(video) ? (
                     <img 
                        src={getThumbnail(video)!} 
                        alt={video.title} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                     />
                ) : (
                    <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-primary-foreground/20">
                    <span className="font-body text-xs uppercase tracking-widest text-primary-foreground/30">
                        Thumbnail
                    </span>
                    </div>
                )}
                <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1A2972] via-[#611991] to-[#3F00FF] flex items-center justify-center">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
                {video.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded font-body">
                    {video.duration}
                    </div>
                )}
              </div>
              <h3 className="font-display text-lg font-semibold group-hover:text-accent transition-colors text-black">
                {video.title}
              </h3>
              {video.views && (
                  <p className="font-body text-sm text-gray-500 mt-1">
                      {video.views} Views
                  </p>
              )}
            </a>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default WatchSection;
