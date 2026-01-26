const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-foreground text-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display text-xl font-semibold">
            CATHERINE GELLER
          </p>
          <p className="font-body text-sm text-background/60">
            © {currentYear} Catherine Geller. All rights reserved.
          </p>
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
