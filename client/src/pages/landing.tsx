import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import CategoryGrid from "@/components/category-grid";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { type Product } from "@shared/schema";
import { Upload, Search, MessageCircle, Star, Palette, TrendingUp } from "lucide-react";

export default function Landing() {
  const { data: featuredProducts, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16"> {/* Add padding for fixed header */}
        <HeroSection />

      {/* How It Works Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-foreground mb-4">How ArtisanConnect Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it easy for artisans to showcase their work and for customers to discover unique handmade treasures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* For Artisans */}
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">1. Upload Your Creations</h3>
              <p className="text-muted-foreground">
                Easily upload photos of your handmade items with detailed descriptions. Our AI helps optimize your listings for better visibility.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Palette className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">2. AI-Powered Enhancement</h3>
              <p className="text-muted-foreground">
                Get intelligent pricing suggestions, compelling product descriptions, and marketing content that tells your craft's unique story.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">3. Grow Your Business</h3>
              <p className="text-muted-foreground">
                Connect directly with customers, receive inquiries, and build a loyal following for your handmade creations.
              </p>
            </div>

            {/* For Customers */}
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">4. Discover Unique Items</h3>
              <p className="text-muted-foreground">
                Browse through carefully curated handmade items from talented artisans. Find one-of-a-kind pieces you won't see anywhere else.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">5. Connect with Artisans</h3>
              <p className="text-muted-foreground">
                Message artisans directly to ask questions, request customizations, or learn about their craft process and inspiration.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">6. Support Authentic Craft</h3>
              <p className="text-muted-foreground">
                Every purchase supports independent artisans and helps preserve traditional craftsmanship for future generations.
              </p>
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
}
