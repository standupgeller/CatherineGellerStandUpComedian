import { Play } from "lucide-react";

const videos = [
  {
    id: 1,
    title: "Dating in Your 30s",
    duration: "5:32",
    views: "2.1M views",
  },
  {
    id: 2,
    title: "Family Thanksgiving",
    duration: "7:15",
    views: "1.8M views",
  },
  {
    id: 3,
    title: "The Gym Experience",
    duration: "4:48",
    views: "3.2M views",
  },
  {
    id: 4,
    title: "Online Shopping Addiction",
    duration: "6:21",
    views: "1.5M views",
  },
];

const WatchSection = () => {
  return (
    <section id="watch" className="py-24 md:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-accent mb-4">
            Clips & Highlights
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
            Watch
          </h2>
        </div>

        {/* Featured Video */}
        <div className="mb-12">
          <div className="relative aspect-video bg-foreground/10 rounded-xl overflow-hidden group cursor-pointer">
            <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-primary-foreground/20">
              <span className="font-body text-sm uppercase tracking-widest text-primary-foreground/50">
                Featured Video
              </span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform shadow-gold">
                <Play className="w-8 h-8 md:w-10 md:h-10 text-accent-foreground ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video bg-foreground/10 rounded-lg overflow-hidden mb-4">
                <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-primary-foreground/20">
                  <span className="font-body text-xs uppercase tracking-widest text-primary-foreground/30">
                    Thumbnail
                  </span>
                </div>
                <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <Play className="w-5 h-5 text-accent-foreground ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-foreground/80 text-background text-xs rounded font-body">
                  {video.duration}
                </div>
              </div>
              <h3 className="font-display text-lg font-semibold group-hover:text-accent transition-colors">
                {video.title}
              </h3>
              <p className="font-body text-sm text-primary-foreground/60">
                {video.views}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WatchSection;
