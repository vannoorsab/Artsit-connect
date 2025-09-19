import { useQuery } from "@tanstack/react-query";
import { Palette, Scissors, Shirt, Gem } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { type Category } from "@shared/schema";

const categoryIcons = {
  pottery: Palette,
  woodworking: Scissors,
  textiles: Shirt,
  jewelry: Gem,
};

export default function CategoryGrid() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Shop by Craft</h2>
            <p className="text-muted-foreground">Discover amazing handmade items across various categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-background rounded-xl p-6">
                <Skeleton className="h-12 w-12 mx-auto mb-4 rounded" />
                <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Shop by Craft</h2>
          <p className="text-muted-foreground">Discover amazing handmade items across various categories</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories?.map((category) => {
            const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Palette;
            return (
              <div 
                key={category.id} 
                className="bg-background rounded-xl p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
                data-testid={`category-card-${category.slug}`}
              >
                <IconComponent className="text-primary text-4xl mb-4 mx-auto h-12 w-12" />
                <h3 className="font-medium text-foreground mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">Browse items</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
