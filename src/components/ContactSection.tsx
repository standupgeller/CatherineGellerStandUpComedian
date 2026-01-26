import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLandingPage } from "@/context/LandingPageContext";

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

      // 2. Send email via Edge Function
      const { error: funcError } = await supabase.functions.invoke('send-contact-email', {
        body: formData
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
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    }

    setSubmitting(false);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left side - Info */}
          <div>
            <p className="font-body text-sm uppercase tracking-[0.3em] text-accent mb-4">
              {contactSettings?.subtitle || 'Get in Touch'}
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              {contactSettings?.title || 'Contact'}
            </h2>
            <p className="font-body text-primary-foreground/80 leading-relaxed mb-12">
              {contactSettings?.description || 'For booking inquiries, press requests, or just to say hi — reach out through the form or connect on social media.'}
            </p>

            {/* Contact Info */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-body text-sm text-primary-foreground/60 uppercase tracking-widest">
                    Management
                  </p>
                  <p className="font-body text-primary-foreground">
                    {contactSettings?.management_email || 'booking@catherinegeller.com'}
                  </p>
                </div>
              </div>
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
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={submitting}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
