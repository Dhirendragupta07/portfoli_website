import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const defaultPortfolioItems = [
  {
    id: "1",
    title: "African Savanna",
    description: "A breathtaking series capturing the majesty of African wildlife during the Great Migration.",
    image_url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2068&auto=format&fit=crop",
    category: "Safari",
  },
  {
    id: "2",
    title: "Arctic Expeditions",
    description: "Documenting the fragile beauty of polar ecosystems and their magnificent inhabitants.",
    image_url: "https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=2070&auto=format&fit=crop",
    category: "Arctic",
  },
];

const Portfolio = () => {
  const { data: portfolioItems, isLoading } = useQuery({
    queryKey: ["portfolio-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data.length > 0 ? data : defaultPortfolioItems;
    },
  });

  return (
    <section id="portfolio" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-body text-sm tracking-widest uppercase">
            Featured Work
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
            Portfolio
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {isLoading
            ? Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
              ))
            : portfolioItems?.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg cursor-pointer"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {item.category && (
                      <span className="text-primary text-xs tracking-widest uppercase">
                        {item.category}
                      </span>
                    )}
                    <h3 className="font-display text-2xl font-bold text-foreground mt-2">
                      {item.title}
                    </h3>
                    <p className="font-body text-muted-foreground mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
