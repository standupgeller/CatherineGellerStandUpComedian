import { useLandingPage } from "@/context/LandingPageContext";

const Footer = () => {
  const { footerSettings } = useLandingPage();
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
          </div>

          <div className="flex gap-6">
            <a href="/privacy" className="font-body text-xs uppercase tracking-widest text-background/60 transition-colors">
              Privacy
            </a>
            <a href="/terms" className="font-body text-xs uppercase tracking-widest text-background/60 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
