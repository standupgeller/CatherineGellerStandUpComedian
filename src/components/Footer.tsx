import { Instagram, Twitter, Youtube } from "lucide-react";
import { useLandingPage } from "@/context/LandingPageContext";

const Footer = () => {
  const { footerSettings, contactSettings } = useLandingPage();
  const currentYear = new Date().getFullYear();

  const copyrightText = footerSettings?.copyright_text 
    ? footerSettings.copyright_text.replace('{year}', currentYear.toString())
    : `© ${currentYear} Catherine Geller. All rights reserved.`;

  return (
    <footer className="py-8 bg-foreground text-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display text-xl font-semibold">
            CATHERINE GELLER
          </p>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="font-body text-sm text-background/60">
                {copyrightText}
            </p>
            
            {footerSettings?.show_social_links && contactSettings && (
                <div className="flex gap-4 mt-2 md:mt-0">
                    {contactSettings.instagram_url && (
                        <a href={contactSettings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-background/60 hover:text-accent transition-colors">
                            <Instagram className="w-4 h-4" />
                        </a>
                    )}
                    {contactSettings.twitter_url && (
                        <a href={contactSettings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-background/60 hover:text-accent transition-colors">
                            <Twitter className="w-4 h-4" />
                        </a>
                    )}
                    {contactSettings.youtube_url && (
                        <a href={contactSettings.youtube_url} target="_blank" rel="noopener noreferrer" className="text-background/60 hover:text-accent transition-colors">
                            <Youtube className="w-4 h-4" />
                        </a>
                    )}
                     {contactSettings.tiktok_url && (
                        <a href={contactSettings.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-background/60 hover:text-accent transition-colors">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                        </a>
                    )}
                </div>
            )}
          </div>

          <div className="flex gap-6">
            <a href="#" className="font-body text-xs uppercase tracking-widest text-background/60 hover:text-accent transition-colors">
              Privacy
            </a>
            <a href="#" className="font-body text-xs uppercase tracking-widest text-background/60 hover:text-accent transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
