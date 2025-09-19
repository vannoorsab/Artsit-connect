import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Star, 
  Heart, 
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Package,
  ShoppingBag
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertInquirySchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";

const inquiryFormSchema = insertInquirySchema.omit({
  buyerId: true,
  artisanId: true,
});

const reviewFormSchema = insertReviewSchema.omit({
  buyerId: true,
  artisanId: true,
});

type InquiryFormData = z.infer<typeof inquiryFormSchema>;
type ReviewFormData = z.infer<typeof reviewFormSchema>;

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [favorited, setFavorited] = useState(false);

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ["/api/reviews", productId],
    enabled: !!productId,
  });

  const { data: favorites } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: !!user?.id,
  });

  const { data: artisan } = useQuery({
    queryKey: ["/api/auth/user", product?.artisanId],
    enabled: !!product?.artisanId,
    queryFn: async () => {
      const response = await fetch(`/api/auth/user?id=${product.artisanId}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      return response.json();
    }
  });

  // Check if product is favorited
  useEffect(() => {
    if (favorites && productId) {
      setFavorited(favorites.some(p => p.id === productId));
    }
  }, [favorites, productId]);

  const inquiryForm = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      productId: productId || "",
      subject: "",
      message: "",
    },
  });

  const reviewForm = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      productId: productId || "",
      rating: 5,
      comment: "",
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: async (action: 'add' | 'remove') => {
      if (action === 'add') {
        return apiRequest('POST', '/api/favorites', { productId });
      } else {
        return apiRequest('DELETE', `/api/favorites/${productId}`);
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

  const inquiryMutation = useMutation({
    mutationFn: async (data: InquiryFormData & { artisanId: string }) => {
      return apiRequest('POST', '/api/inquiries', data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Your inquiry has been sent to the artisan.",
        variant: "default",
      });
      setContactDialogOpen(false);
      inquiryForm.reset();
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
        description: "Failed to send inquiry",
        variant: "destructive",
      });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async (data: ReviewFormData & { artisanId: string }) => {
      return apiRequest('POST', '/api/reviews', data);
    },
    onSuccess: () => {
      toast({
        title: "Review Submitted",
        description: "Thank you for your review!",
        variant: "default",
      });
      setReviewDialogOpen(false);
      reviewForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", productId] });
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
        description: "Failed to submit review",
        variant: "destructive",
      });
    },
  });

  const handleFavoriteClick = () => {
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

  const handleContactClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to contact artisans",
        variant: "default"
      });
      return;
    }
    
    inquiryForm.setValue('productId', productId || '');
    inquiryForm.setValue('subject', `Inquiry about ${product?.title}`);
    setContactDialogOpen(true);
  };

  const handleReviewClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave reviews",
        variant: "default"
      });
      return;
    }
    
    reviewForm.setValue('productId', productId || '');
    setReviewDialogOpen(true);
  };

  const onSubmitInquiry = (data: InquiryFormData) => {
    if (!product?.artisanId) return;
    inquiryMutation.mutate({ ...data, artisanId: product.artisanId });
  };

  const onSubmitReview = (data: ReviewFormData) => {
    if (!product?.artisanId) return;
    reviewMutation.mutate({ ...data, artisanId: product.artisanId });
  };

  const nextImage = () => {
    if (!product?.images) return;
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!product?.images) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  if (productLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="w-full h-96 rounded-xl mb-4" />
              <div className="flex space-x-2">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="w-20 h-20 rounded" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/marketplace">
              <Button>Browse Marketplace</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const artisanName = artisan?.firstName && artisan?.lastName
    ? `${artisan.firstName} ${artisan.lastName}`
    : 'Unknown Artisan';

  const averageRating = reviews?.length 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  const currentImage = product.images?.[currentImageIndex] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={currentImage}
                alt={product.title} 
                className="w-full h-96 object-cover rounded-xl"
                data-testid="img-product-main"
              />
              
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                    data-testid="button-prev-image"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
                    data-testid="button-next-image"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                      index === currentImageIndex ? 'border-primary' : 'border-border opacity-60'
                    }`}
                    data-testid={`button-image-thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-4" data-testid="text-product-title">
                {product.title}
              </h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-foreground" data-testid="text-product-price">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                {reviews?.length && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                    <span data-testid="text-product-rating">
                      {averageRating.toFixed(1)} ({reviews.length} reviews)
                    </span>
                  </div>
                )}
              </div>
              
              {product.aiEnhanced && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <div className="ai-badge text-white p-1.5 rounded mr-2" data-testid="badge-ai-enhanced">AI</div>
                    <span className="text-sm font-medium">AI-Enhanced Description</span>
                  </div>
                  <p className="text-sm text-muted-foreground">This product description has been optimized using AI for better storytelling and search visibility.</p>
                </div>
              )}
              
              <p className="text-foreground leading-relaxed mb-6 whitespace-pre-wrap" data-testid="text-product-description">
                {product.description}
              </p>
            </div>
            
            {/* Product Details */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-foreground mb-4">Product Details</h3>
                {product.materials && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Materials:</span>
                    <span className="text-foreground" data-testid="text-product-materials">{product.materials}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dimensions:</span>
                    <span className="text-foreground" data-testid="text-product-dimensions">{product.dimensions}</span>
                  </div>
                )}
                {product.careInstructions && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Care:</span>
                    <span className="text-foreground" data-testid="text-product-care">{product.careInstructions}</span>
                  </div>
                )}
                {artisan?.location && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ships from:</span>
                    <span className="text-foreground">{artisan.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Artisan Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Link href={`/artisan/${product.artisanId}`}>
                    {artisan?.profileImageUrl ? (
                      <img
                        src={artisan.profileImageUrl}
                        alt={artisanName}
                        className="w-12 h-12 rounded-full object-cover"
                        data-testid="img-artisan-avatar"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </Link>
                  <div className="flex-1">
                    <Link href={`/artisan/${product.artisanId}`}>
                      <p className="font-medium text-foreground hover:text-primary transition-colors" data-testid="text-artisan-name">
                        {artisanName}
                      </p>
                    </Link>
                    {artisan?.isVerified && (
                      <p className="text-sm text-muted-foreground">Verified Artisan</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleContactClick} 
                className="w-full"
                data-testid="button-contact-artisan"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Artisan
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={handleFavoriteClick}
                  disabled={favoriteMutation.isPending}
                  className="flex-1"
                  data-testid="button-add-favorite"
                >
                  <Heart className={`h-4 w-4 mr-2 ${favorited ? 'fill-current text-red-500' : ''}`} />
                  {favorited ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleReviewClick}
                  className="flex-1"
                  data-testid="button-write-review"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Write Review
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Customer Reviews
            </h2>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-semibold" data-testid="text-average-rating">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({reviews?.length || 0} reviews)
              </span>
            </div>
          </div>
          
          <div className="space-y-6">
            {reviewsLoading ? (
              Array.from({ length: 3 }, (_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : reviews?.length ? (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-medium text-foreground">Customer</span>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-foreground" data-testid={`text-review-comment-${review.id}`}>
                            {review.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Reviews Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to review this product!
                  </p>
                  <Button onClick={handleReviewClick} data-testid="button-first-review">
                    Write First Review
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
      
      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Artisan</DialogTitle>
            <DialogDescription>
              Send a message about this product to {artisanName}.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...inquiryForm}>
            <form onSubmit={inquiryForm.handleSubmit(onSubmitInquiry)} className="space-y-4">
              <FormField
                control={inquiryForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="What would you like to ask about?"
                        data-testid="input-inquiry-subject"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={inquiryForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="I'm interested in this product..."
                        data-testid="textarea-inquiry-message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setContactDialogOpen(false)}
                  className="flex-1"
                  data-testid="button-cancel-inquiry"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={inquiryMutation.isPending}
                  className="flex-1"
                  data-testid="button-send-inquiry"
                >
                  {inquiryMutation.isPending ? (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with this product.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...reviewForm}>
            <form onSubmit={reviewForm.handleSubmit(onSubmitReview)} className="space-y-4">
              <FormField
                control={reviewForm.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => field.onChange(i + 1)}
                            className="p-1"
                            data-testid={`button-rating-${i + 1}`}
                          >
                            <Star
                              className={`h-6 w-6 ${
                                i < field.value 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">
                          {field.value} star{field.value !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={reviewForm.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        placeholder="Share your thoughts about this product..."
                        data-testid="textarea-review-comment"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReviewDialogOpen(false)}
                  className="flex-1"
                  data-testid="button-cancel-review"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={reviewMutation.isPending}
                  className="flex-1"
                  data-testid="button-submit-review"
                >
                  {reviewMutation.isPending ? (
                    <>
                      <Star className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
