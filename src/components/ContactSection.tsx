import { useState } from "react";
import { Mail, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLandingPage } from "@/context/LandingPageContext";
import AnimatedSection from "./AnimatedSection";

const ContactSection = () => {
  const { contactSettings } = useLandingPage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Save to database
      const { error: dbError } = await supabase.from('contact_submissions').insert([
        { 
            name: formData.name, 
            email: formData.email, 
            subject: formData.subject, 
            message: formData.message 
        }
      ]);

      if (dbError) throw dbError;

      // 2. Send email via Edge Function (Gmail)
      const { error: funcError } = await supabase.functions.invoke('gmail-notify', {
        body: { ...formData, recipientEmail: contactSettings?.management_email || null }
      });

      if (funcError) {
          console.error("Failed to send email:", funcError);
          // We don't throw here because DB save was successful, 
          // so the admin can still see it in CMS.
      }

      toast({
        title: 'Message Sent!',
        description: 'Thank you for reaching out. We\'ll get back to you soon.'
      });

      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: unknown) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    }

    setSubmitting(false);
  };

  return (
    <AnimatedSection id="contact" className="py-24 md:py-32 bg-secondary text-foreground">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left side - Info */}
          <div>
            <p className="font-body text-sm uppercase tracking-[0.3em] text-black mb-4">
              {contactSettings?.subtitle || 'Get in Touch'}
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-black">
              {contactSettings?.title || 'Contact'}
            </h2>
            <p className="font-body text-foreground/80 leading-relaxed mb-12">
              {contactSettings?.description || 'For booking inquiries, press requests, or just to say hi — reach out through the form or connect on social media.'}
            </p>

            {/* Contact Info */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="font-body text-sm text-muted-foreground uppercase tracking-widest">
                    Management
                  </p>
                  <p className="font-body text-foreground">
                    {contactSettings?.management_email || 'booking@catherinegeller.com'}
                  </p>
                </div>
              </div>

              {/* Social Media Icons */}
              {contactSettings && (
                <div className="flex gap-4 pt-4">
                    {contactSettings.instagram_url && (
                        <a href={contactSettings.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-foreground hover:bg-gradient-to-tr hover:from-[#1A2972] hover:via-[#611991] hover:to-[#3F00FF] hover:text-white transition-all duration-300">
                            <Instagram className="w-5 h-5" />
                        </a>
                    )}
                    {contactSettings.twitter_url && (
                        <a href={contactSettings.twitter_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-foreground hover:bg-gradient-to-tr hover:from-[#1A2972] hover:via-[#611991] hover:to-[#3F00FF] hover:text-white transition-all duration-300">
                            <Twitter className="w-5 h-5" />
                        </a>
                    )}
                    {contactSettings.youtube_url && (
                        <a href={contactSettings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-foreground hover:bg-gradient-to-tr hover:from-[#1A2972] hover:via-[#611991] hover:to-[#3F00FF] hover:text-white transition-all duration-300">
                            <Youtube className="w-5 h-5" />
                        </a>
                    )}
                     {contactSettings.tiktok_url && (
                        <a href={contactSettings.tiktok_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-foreground hover:bg-gradient-to-tr hover:from-[#1A2972] hover:via-[#611991] hover:to-[#3F00FF] hover:text-white transition-all duration-300">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                        </a>
                    )}
                </div>
              )}
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-background rounded-2xl p-8 md:p-12 shadow-elevated">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="font-body text-sm font-medium text-foreground">
                    Name
                  </label>
                  <Input
                    id="name"
                    required
                    className="text-foreground border-border bg-input"
                    value={formData.name}
                    placeholder="Your name"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="font-body text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="text-foreground border-border bg-input"
                    value={formData.email}
                    placeholder="you@gmail.com"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="font-body text-sm font-medium text-foreground">
                  Subject
                </label>
                <Input
                  id="subject"
                  className="text-foreground border-border bg-input"
                  value={formData.subject}
                    placeholder="Booking inquiry, press, or general question"
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="font-body text-sm font-medium text-foreground">
                  Message
                </label>
                <Textarea
                  id="message"
                  required
                  rows={6}
                  className="text-foreground border-border bg-input resize-none"
                  value={formData.message}
                    placeholder="Tell us more about your request..."
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <Button 
                type="submit" 
                variant="gradient"
                className="w-full bg-gradient-to-tr from-[#1A2972] via-[#611991] to-[#3F00FF] hover:opacity-90"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ContactSection;
