import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "HOME" },
    { href: "#portfolio", label: "PORTFOLIO" },
    { href: "#gallery", label: "GALLERY" },
    { href: "#experience", label: "EXPERIENCE" },
    { href: "#contact", label: "CONTACT" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-2xl font-bold text-primary tracking-wider"
        >
          KNOXS
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-sm font-body tracking-widest text-foreground/80 hover:text-primary transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/auth")}
            className="text-foreground/80 hover:text-primary"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-body tracking-widest text-foreground/80 hover:text-primary transition-colors text-left"
              >
                {link.label}
              </button>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                navigate("/auth");
                setIsMobileMenuOpen(false);
              }}
              className="w-fit border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <User className="h-4 w-4 mr-2" />
              Admin Login
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
