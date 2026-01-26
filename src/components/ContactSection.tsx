import { useState, useEffect } from "react";
import { Mail, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactSettings {
  title: string;
  subtitle: string;
  description: string;
  management_email: string;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
}

const ContactSection = () => {
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('contact_settings')
        .select('*')
        .maybeSingle();
      
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) throw error;

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
              {settings?.subtitle || 'Get in Touch'}
            </p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              {settings?.title || 'Contact'}
            </h2>
            <p className="font-body text-primary-foreground/80 leading-relaxed mb-12">
              {settings?.description || 'For booking inquiries, press requests, or just to say hi — reach out through the form or connect on social media.'}
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
                    {settings?.management_email || 'booking@catherinegeller.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="font-body text-sm uppercase tracking-widest text-primary-foreground/60 mb-4">
                Follow Along
              </p>
              <div className="flex gap-4">
                {settings?.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {settings?.twitter_url && (
                  <a
                    href={settings.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {settings?.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
                {!settings?.instagram_url && !settings?.twitter_url && !settings?.youtube_url && (
                  <>
                    <a
                      href="#"
                      className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-primary-foreground/5 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="font-body text-sm uppercase tracking-widest text-primary-foreground/60 mb-2 block">
                    Name
                  </label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent"
                  />
                </div>
                <div>
                  <label className="font-body text-sm uppercase tracking-widest text-primary-foreground/60 mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-sm uppercase tracking-widest text-primary-foreground/60 mb-2 block">
                  Subject
                </label>
                <Input
                  type="text"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent"
                />
              </div>

              <div>
                <label className="font-body text-sm uppercase tracking-widest text-primary-foreground/60 mb-2 block">
                  Message
                </label>
                <Textarea
                  placeholder="Your message..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full font-body uppercase tracking-widest bg-accent text-accent-foreground hover:bg-accent/90 py-6"
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
