import { ArrowDown, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToPortfolio = () => {
    const element = document.querySelector("#portfolio");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=2077&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto animate-fade-in">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Camera className="h-5 w-5 text-primary" />
          <span className="text-primary font-body text-sm tracking-widest uppercase">
            Wildlife Photographer
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight">
          Capturing the
          <span className="block text-primary">Wild Soul</span>
        </h1>

        <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Award-winning wildlife photographer with over 15 years of experience
          documenting nature's most extraordinary moments across six continents.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={scrollToPortfolio}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-sm tracking-widest"
          >
            VIEW PORTFOLIO
          </Button>
          <Button
            onClick={scrollToContact}
            variant="outline"
            className="border-foreground/30 text-foreground hover:bg-foreground/10 px-8 py-6 text-sm tracking-widest"
          >
            GET IN TOUCH
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToPortfolio}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-foreground/50 hover:text-primary transition-colors animate-bounce"
      >
        <ArrowDown className="h-6 w-6" />
      </button>
    </section>
  );
};

export default Hero;
