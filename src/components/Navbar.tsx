import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLandingPage } from "@/context/LandingPageContext";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { navLinks, siteSettings } = useLandingPage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const siteName = siteSettings?.site_name || "Catherine Geller";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
        window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (href: string) => {
    // If we're not on the home page and the link is a hash link, navigate to home first
    if (location.pathname !== "/" && href.startsWith("#")) {
      navigate("/");
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };
  
  // Fallback links if DB is empty
  const defaultLinks = [
      { name: "About", href: "#about", id: '1' },
      { name: "Projects", href: "#projects", id: '2' },
      { name: "Watch", href: "#watch", id: '3' },
      { name: "Tour", href: "#tour", id: '4' },
      { name: "Archive", href: "#archive", id: '5' },
      { name: "Contact", href: "#contact", id: '6' },
  ];
  
  const displayLinks = navLinks.length > 0 ? navLinks : defaultLinks;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-soft py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollToSection("#hero")}
          className={`font-display text-2xl md:text-3xl font-semibold tracking-wide transition-colors ${
            isScrolled ? "text-black hover:text-primary" : "text-black hover:text-primary"
          }`}
        >
          {siteName}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {displayLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.href)}
              className={`font-body text-sm uppercase tracking-widest transition-all px-3 py-1 rounded-md transform hover:scale-105 ${
                isScrolled ? "text-black hover:text-white hover:bg-gradient-to-tr hover:from-[#1A2972] hover:via-[#611991] hover:to-[#3F00FF]" : "text-black hover:text-white hover:bg-gradient-to-tr hover:from-[#1A2972] hover:via-[#611991] hover:to-[#3F00FF]"
              }`}
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-lg border-b border-border animate-fade-in">
          <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
            {displayLinks.map((link, index) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.href)}
                className="font-body text-lg uppercase tracking-widest text-foreground/80 hover:text-accent transition-colors text-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
