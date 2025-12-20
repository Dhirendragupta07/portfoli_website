import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const defaultGalleryImages = [
  { id: "1", image_url: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?q=80&w=2072&auto=format&fit=crop", alt_text: "Lion in savanna" },
  { id: "2", image_url: "https://images.unsplash.com/photo-1535338454770-8be927b5a00b?q=80&w=2044&auto=format&fit=crop", alt_text: "Eagle in flight" },
  { id: "3", image_url: "https://images.unsplash.com/photo-1504173010664-32509aeebb62?q=80&w=2069&auto=format&fit=crop", alt_text: "Elephant herd" },
  { id: "4", image_url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=2032&auto=format&fit=crop", alt_text: "Tiger in wild" },
  { id: "5", image_url: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=2072&auto=format&fit=crop", alt_text: "Giraffe portrait" },
  { id: "6", image_url: "https://images.unsplash.com/photo-1551085254-e96b210db58a?q=80&w=2021&auto=format&fit=crop", alt_text: "Penguin colony" },
  { id: "7", image_url: "https://images.unsplash.com/photo-1606567595334-d39972c85dfd?q=80&w=1974&auto=format&fit=crop", alt_text: "Cheetah running" },
  { id: "8", image_url: "https://images.unsplash.com/photo-1544985361-b420d7a77043?q=80&w=1974&auto=format&fit=crop", alt_text: "Owl eyes" },
  { id: "9", image_url: "https://images.unsplash.com/photo-1552410260-0fd9e8f4a8b5?q=80&w=2070&auto=format&fit=crop", alt_text: "Polar bear" },
];

const Gallery = () => {
  const { data: galleryImages, isLoading } = useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data.length > 0 ? data : defaultGalleryImages;
    },
  });

  // Distribute images into 3 columns for masonry effect
  const columns: typeof defaultGalleryImages[] = [[], [], []];
  galleryImages?.forEach((img, index) => {
    columns[index % 3].push(img);
  });

  return (
    <section id="gallery" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-body text-sm tracking-widest uppercase">
            Visual Stories
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-4">
            Gallery
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 9 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className={`rounded-lg ${
                    i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-square" : "aspect-[4/3]"
                  }`}
                />
              ))
            : columns.map((column, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-4">
                  {column.map((image, imgIndex) => (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden rounded-lg"
                    >
                      <img
                        src={image.image_url}
                        alt={image.alt_text || "Wildlife photo"}
                        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
