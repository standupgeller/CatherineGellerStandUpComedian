import { useState } from "react";
import { MapPin, Calendar, ArrowRight, Clock, Info, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLandingPage } from "@/context/LandingPageContext";
import { Database } from "@/integrations/supabase/types";
import AnimatedSection from "./AnimatedSection";

type TourDate = Database['public']['Tables']['tour_dates']['Row'];

const TourSection = () => {
  const { tourDates } = useLandingPage();
  const [selectedTour, setSelectedTour] = useState<TourDate | null>(null);

  const formatDate = (dateStr: string) => {
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      } catch (e) {
          return dateStr;
      }
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return "";
    try {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } catch (e) {
      return timeStr;
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
    <AnimatedSection id="tour" className="py-24 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-sm uppercase tracking-[0.3em] text-accent mb-4">
            Live Shows
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-tr from-[#1A2972] via-[#611991] to-[#3F00FF] bg-clip-text text-transparent mb-4">
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
              onClick={() => setSelectedTour(show)}
              className="group bg-card rounded-xl p-6 md:p-8 shadow-soft hover:shadow-elevated transition-all duration-300 border border-transparent hover:border-accent/20 cursor-pointer"
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
                    <span className="font-display text-xl font-semibold bg-gradient-to-r from-[#1A2972] to-[#611991] bg-clip-text text-transparent">
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
                        variant="gradient"
                        className="hidden md:flex transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5" 
                        asChild
                        onClick={(e) => e.stopPropagation()} 
                    >
                        <a href={show.ticket_url || '#'} target="_blank" rel="noopener noreferrer">
                            Get Tickets
                        </a>
                    </Button>
                  )}
                  <ArrowRight className="w-5 h-5 text-muted-foreground md:hidden" />
                </div>
              </div>
            </div>
          );
          })
          ) : (
             <div className="text-center text-muted-foreground">No upcoming dates.</div>
          )}
        </div>

        {/* Tour Details Dialog */}
        <Dialog open={!!selectedTour} onOpenChange={(open) => !open && setSelectedTour(null)}>
          <DialogContent className="sm:max-w-lg bg-background border-border">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-bold bg-gradient-to-r from-[#1A2972] to-[#611991] bg-clip-text text-transparent">
                {selectedTour?.city}{selectedTour?.country ? `, ${selectedTour.country}` : ''}
              </DialogTitle>
              <DialogDescription className="font-body text-muted-foreground">
                {selectedTour?.venue_name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedTour && (
              <div className="space-y-6 py-4">
                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">Date</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span className="font-semibold">{formatDate(selectedTour.event_date)}</span>
                    </div>
                  </div>
                  {selectedTour.event_time && (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">Time</span>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="font-semibold">{formatTime(selectedTour.event_time)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                     <Info className="w-3 h-3" /> Status
                  </span>
                  <span className={`font-semibold inline-flex items-center w-fit px-2 py-0.5 rounded-full text-sm ${
                      selectedTour.status === 'sold_out'
                        ? "bg-muted text-muted-foreground"
                        : formatStatus(selectedTour.status) === "Few Left"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-accent/20 text-accent"
                    }`}>
                    {formatStatus(selectedTour.status)}
                  </span>
                </div>

                {/* Additional Info */}
                {selectedTour.additional_info && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Info className="w-3 h-3" /> Event Details
                    </span>
                    <p className="text-sm leading-relaxed text-foreground/80 bg-secondary/50 p-3 rounded-md border border-border/50">
                      {selectedTour.additional_info}
                    </p>
                  </div>
                )}

                {/* Price */}
                {selectedTour.ticket_price && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                       <Ticket className="w-3 h-3" /> Ticket Price
                    </span>
                    <span className="font-semibold text-lg">{selectedTour.ticket_price}</span>
                  </div>
                )}

                {/* Action Button */}
                {selectedTour.status !== 'sold_out' && (
                  <div className="pt-4">
                    <Button 
                      className="w-full font-body uppercase tracking-widest" 
                      variant="gradient" 
                      size="lg"
                      asChild
                    >
                      <a href={selectedTour.ticket_url || '#'} target="_blank" rel="noopener noreferrer">
                        Get Tickets
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AnimatedSection>
  );
};

export default TourSection;
