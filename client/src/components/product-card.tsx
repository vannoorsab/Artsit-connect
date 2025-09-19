import { Link } from "wouter";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product & {
    artisan?: {
      firstName: string | null;
      lastName: string | null;
    };
    category?: {
      name: string;
    };
    _count?: {
      reviews: number;
    };
    averageRating?: number;
  };
  isFavorited?: boolean;
}

export default function ProductCard({ product, isFavorited = false }: ProductCardProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [favorited, setFavorited] = useState(isFavorited);

  const favoriteMutation = useMutation({
    mutationFn: async (action: 'add' | 'remove') => {
      if (action === 'add') {
        return apiRequest('POST', '/api/favorites', { productId: product.id });
      } else {
        return apiRequest('DELETE', `/api/favorites/${product.id}`);
      }
    },
    onSuccess: (_, action) => {
      setFavorited(action === 'add');
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: action === 'add' ? "Added to favorites" : "Removed from favorites",
        variant: "default"
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
    },
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites",
        variant: "default"
      });
      return;
    }

    favoriteMutation.mutate(favorited ? 'remove' : 'add');
  };

  const artisanName = product.artisan?.firstName && product.artisan?.lastName
    ? `${product.artisan.firstName} ${product.artisan.lastName}`
    : 'Unknown Artisan';

  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';

  return (
    <div className="product-card bg-background rounded-xl overflow-hidden shadow-sm" data-testid={`product-card-${product.id}`}>
      <Link href={`/product/${product.id}`}>
        <div className="relative">
          <img 
            src={mainImage}
            alt={product.title} 
            className="w-full h-48 object-cover"
            data-testid="img-product"
          />
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            disabled={favoriteMutation.isPending}
            data-testid="button-favorite"
          >
            <Heart 
              className={`h-4 w-4 ${favorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-foreground line-clamp-2 text-sm" data-testid="text-product-title">
              {product.title}
            </h3>
          </div>
        </Link>
        
        <Link href={`/artisan/${product.artisanId}`}>
          <p className="text-sm text-muted-foreground mb-3 hover:text-foreground transition-colors" data-testid="text-artisan-name">
            by {artisanName}
          </p>
        </Link>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground" data-testid="text-price">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          {product.averageRating && product._count?.reviews && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
              <span data-testid="text-rating">
                {product.averageRating.toFixed(1)} ({product._count.reviews})
              </span>
            </div>
          )}
        </div>
        
        {product.aiEnhanced && (
          <div className="mt-3 flex items-center text-xs text-muted-foreground">
            <div className="ai-badge text-white px-2 py-0.5 rounded mr-2" data-testid="badge-ai">AI</div>
            Enhanced listing
          </div>
        )}
      </div>
    </div>
  );
}
