import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const defaultExperience = [
  {
    id: "1",
    year: "2020",
    title: "National Geographic Feature",
    description: "Featured photographer for National Geographic's 'Wild Earth' documentary series.",
  },
  {
    id: "2",
    year: "2018",
    title: "Wildlife Photographer of the Year",
    description: "Winner of the prestigious Wildlife Photographer of the Year award.",
  },
  {
    id: "3",
    year: "2015",
    title: "Amazon Expedition",
    description: "Led a 6-month expedition documenting rare species in the Amazon rainforest.",
  },
  {
    id: "4",
    year: "2010",
    title: "Career Beginning",
    description: "Started professional wildlife photography journey in Kenya's Maasai Mara.",
  },
];

const Experience = () => {
  const { data: experienceEntries, isLoading } = useQuery({
    queryKey: ["experience-entries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experience_entries")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data.length > 0 ? data : defaultExperience;
    },
  });

  return (
    <section id="experience" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-body text-sm tracking-widest uppercase">
            Journey
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
            Experience
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-8 mb-12">
                  <Skeleton className="w-20 h-8" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ))
            : experienceEntries?.map((entry, index) => (
                <div
                  key={entry.id}
                  className="relative flex gap-8 mb-12 last:mb-0"
                >
                  {/* Timeline line */}
                  {index < (experienceEntries?.length || 0) - 1 && (
                    <div className="absolute left-[2.5rem] top-10 bottom-0 w-px bg-border" />
                  )}

                  {/* Year */}
                  <div className="w-20 flex-shrink-0">
                    <span className="font-display text-xl font-bold text-primary">
                      {entry.year}
                    </span>
                  </div>

                  {/* Timeline dot */}
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-primary mt-2" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {entry.title}
                    </h3>
                    <p className="font-body text-muted-foreground mt-2">
                      {entry.description}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
