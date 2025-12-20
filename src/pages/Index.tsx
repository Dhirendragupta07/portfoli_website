import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Portfolio from "@/components/sections/Portfolio";
import Gallery from "@/components/sections/Gallery";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Portfolio />
      <Gallery />
      <Experience />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
