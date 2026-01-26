import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const tourDates = [
  {
    id: 1,
    date: "Jan 15, 2025",
    city: "New York, NY",
    venue: "Madison Square Garden",
    status: "On Sale",
  },
  {
    id: 2,
    date: "Jan 22, 2025",
    city: "Los Angeles, CA",
    venue: "The Forum",
    status: "On Sale",
  },
  {
    id: 3,
    date: "Feb 5, 2025",
    city: "Chicago, IL",
    venue: "Chicago Theatre",
    status: "Few Left",
  },
  {
    id: 4,
    date: "Feb 12, 2025",
    city: "Austin, TX",
    venue: "Moody Theater",
    status: "On Sale",
  },
  {
    id: 5,
    date: "Feb 28, 2025",
    city: "Miami, FL",
    venue: "Fillmore Miami Beach",
    status: "Sold Out",
  },
];

const TourSection = () => {
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
          {tourDates.map((show) => (
            <div
              key={show.id}
              className="group bg-card rounded-xl p-6 md:p-8 shadow-soft hover:shadow-elevated transition-all duration-300 border border-transparent hover:border-accent/20"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Date */}
                <div className="flex items-center gap-4 md:w-48">
                  <Calendar className="w-5 h-5 text-accent" />
                  <span className="font-body font-semibold text-foreground">
                    {show.date}
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
                    {show.venue}
                  </span>
                </div>

                {/* Status & Button */}
                <div className="flex items-center gap-4">
                  <span
                    className={`font-body text-xs uppercase tracking-widest px-3 py-1 rounded-full ${
                      show.status === "Sold Out"
                        ? "bg-muted text-muted-foreground"
                        : show.status === "Few Left"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-accent/20 text-accent"
                    }`}
                  >
                    {show.status}
                  </span>
                  <Button
                    variant={show.status === "Sold Out" ? "ghost" : "default"}
                    disabled={show.status === "Sold Out"}
                    className="font-body uppercase tracking-widest text-xs"
                  >
                    {show.status === "Sold Out" ? "Notify Me" : "Get Tickets"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-16 text-center">
          <p className="font-body text-muted-foreground mb-4">
            Don't see your city? Sign up to be notified when new dates are announced.
          </p>
          <Button
            variant="outline"
            className="font-body uppercase tracking-widest text-sm border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Join the Mailing List
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TourSection;
