import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Plus, TrendingUp, Heart, MessageSquare } from "lucide-react";
import { type Product, type Inquiry } from "@shared/schema";

type ArtisanStats = {
  totalProducts: number;
  totalInquiries: number;
  averageRating: number;
  totalReviews: number;
};

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  const { data: userProducts, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { artisanId: user?.id }],
    enabled: !!user?.id,
  });

  const { data: favorites, isLoading: favoritesLoading } = useQuery<Product[]>({
    queryKey: ["/api/favorites"],
    enabled: !!user?.id,
  });

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries"],
    enabled: !!user?.id,
  });

  const { data: stats } = useQuery<ArtisanStats>({
    queryKey: ["/api/artisan", user?.id, "stats"],
    enabled: !!user?.id,
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-64 mb-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Welcome Section */}
      <section className="py-12 bg-gradient-to-br from-accent/10 to-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
              Welcome back, {user?.firstName || 'Artisan'}!
            </h1>
            <p className="text-xl text-muted-foreground">
              Ready to showcase your latest creations?
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2" data-testid="stat-products">
                {stats?.totalProducts || 0}
              </div>
              <p className="text-sm text-muted-foreground">Products Listed</p>
            </div>
            <div className="bg-card rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-secondary mb-2" data-testid="stat-inquiries">
                {stats?.totalInquiries || 0}
              </div>
              <p className="text-sm text-muted-foreground">Inquiries Received</p>
            </div>
            <div className="bg-card rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-accent-foreground mb-2" data-testid="stat-rating">
                {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}★
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            <div className="bg-card rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-2" data-testid="stat-reviews">
                {stats?.totalReviews || 0}
              </div>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/upload">
              <button className="btn-primary flex items-center px-6 py-3" data-testid="button-add-product">
                <Plus className="mr-2 h-5 w-5" />
                Add New Product
              </button>
            </Link>
            <Link href="/marketplace">
              <button className="btn-outline flex items-center px-6 py-3" data-testid="button-browse-marketplace">
                <TrendingUp className="mr-2 h-5 w-5" />
                Browse Marketplace
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Products */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">My Products</h2>
              <Link href="/upload">
                <button className="btn-primary text-sm" data-testid="button-add-product-header">
                  Add Product
                </button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {productsLoading ? (
                Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="bg-card rounded-xl overflow-hidden shadow-sm">
                    <Skeleton className="w-full h-48" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                ))
              ) : userProducts?.length ? (
                userProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-2 text-center py-12 bg-card rounded-xl">
                  <p className="text-muted-foreground mb-4">You haven't listed any products yet.</p>
                  <Link href="/upload">
                    <button className="btn-primary" data-testid="button-create-first-product">
                      Create Your First Product
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Inquiries */}
            <div className="bg-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Inquiries</h3>
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              </div>
              
              {inquiriesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : inquiries?.length ? (
                <div className="space-y-3">
                  {inquiries.slice(0, 3).map((inquiry) => (
                    <div key={inquiry.id} className="border-l-2 border-primary pl-3">
                      <p className="text-sm font-medium text-foreground" data-testid="text-inquiry-subject">
                        {inquiry.subject}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(inquiry.createdAt!).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No inquiries yet.</p>
              )}
            </div>

            {/* Favorites */}
            <div className="bg-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">My Favorites</h3>
                <Heart className="h-5 w-5 text-muted-foreground" />
              </div>
              
              {favoritesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }, (_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : favorites?.length ? (
                <div className="space-y-3">
                  {favorites.slice(0, 3).map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`}>
                      <div className="flex items-center space-x-3 hover:bg-accent/20 p-2 rounded transition-colors">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96'}
                          alt={product.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {product.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ${parseFloat(product.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No favorites yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
