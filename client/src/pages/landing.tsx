import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import CategoryGrid from "@/components/category-grid";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Landing() {
  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <CategoryGrid />
      
      {/* Featured Products Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Featured Creations</h2>
            <p className="text-muted-foreground">Discover amazing handmade items from our talented artisans</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsLoading ? (
              Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="bg-background rounded-xl overflow-hidden shadow-sm">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              featuredProducts?.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          
          {!productsLoading && featuredProducts && featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products available yet. Be the first to list your creation!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
