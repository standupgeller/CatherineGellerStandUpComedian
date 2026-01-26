import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLandingPage } from "@/context/LandingPageContext";

const TourSection = () => {
  const { tourDates } = useLandingPage();

  const formatDate = (dateStr: string) => {
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch (e) {
          return dateStr;
      }
  };

  const formatStatus = (status: string | null) => {
      if (!status) return "On Sale";
      const map: Record<string, string> = {
          'available': 'On Sale',
          'sold_out': 'Sold Out',
          'cancelled': 'Cancelled',
          'postponed': 'Postponed',
          'few_left': 'Few Left'
      };
      return map[status] || status.replace(/_/g, ' '); 
  };

  return (
    <section id="tour" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-accent mb-4">
            Live Shows
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
            Tour Dates
          </h2>
          <p className="font-body text-foreground/60 max-w-xl mx-auto">
            Catch Catherine live on her upcoming tour. New dates being added regularly!
          </p>
        </div>

        {/* Tour Dates List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {tourDates.length > 0 ? (
            tourDates.map((show) => {
            const displayStatus = formatStatus(show.status);
            const isSoldOut = show.status === 'sold_out';
            
            return (
            <div
              key={show.id}
              className="group bg-card rounded-xl p-6 md:p-8 shadow-soft hover:shadow-elevated transition-all duration-300 border border-transparent hover:border-accent/20"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Date */}
                <div className="flex items-center gap-4 md:w-48">
                  <Calendar className="w-5 h-5 text-accent" />
                  <span className="font-body font-semibold text-foreground">
                    {formatDate(show.event_date)}
                  </span>
                </div>

                {/* Location */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-display text-xl font-semibold text-primary">
                      {show.city}
                    </span>
                  </div>
                  <span className="font-body text-sm text-muted-foreground">
                    {show.venue_name}
                  </span>
                </div>

                {/* Status & Button */}
                <div className="flex items-center gap-4">
                  <span
                    className={`font-body text-xs uppercase tracking-widest px-3 py-1 rounded-full ${
                      isSoldOut
                        ? "bg-muted text-muted-foreground"
                        : displayStatus === "Few Left"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-accent/20 text-accent"
                    }`}
                  >
                    {displayStatus}
                  </span>
                  
                  {!isSoldOut && (
                    <Button 
                        size="sm" 
                        className="hidden md:flex" 
                        asChild
                    >
                        <a href={show.ticket_url || '#'} target="_blank" rel="noopener noreferrer">
                            Get Tickets
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                    </Button>
                  )}
                </div>
              </div>
              {/* Mobile Button */}
              {!isSoldOut && (
                <div className="mt-4 md:hidden">
                    <Button className="w-full" asChild>
                        <a href={show.ticket_url || '#'} target="_blank" rel="noopener noreferrer">
                            Get Tickets
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                    </Button>
                </div>
              )}
            </div>
          )})
          ) : (
             <div className="text-center text-muted-foreground">No upcoming dates found.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TourSection;
