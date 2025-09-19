import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Star, 
  Package, 
  Calendar, 
  MessageSquare, 
  Heart, 
  MapPin,
  Mail,
  Wand2,
  User
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
import { insertInquirySchema } from "@shared/schema";
import { z } from "zod";

const inquiryFormSchema = insertInquirySchema.omit({
  buyerId: true,
  artisanId: true,
});

type InquiryFormData = z.infer<typeof inquiryFormSchema>;

export default function ArtisanProfile() {
  const [, params] = useRoute("/artisan/:id");
  const artisanId = params?.id;
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [followDialogOpen, setFollowDialogOpen] = useState(false);

  const { data: artisan, isLoading: artisanLoading } = useQuery({
    queryKey: ["/api/auth/user", artisanId],
    enabled: !!artisanId,
    queryFn: async () => {
      const response = await fetch(`/api/auth/user?id=${artisanId}`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      return response.json();
    }
  });

  const { data: artisanProducts, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products", { artisanId }],
    enabled: !!artisanId,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/artisan", artisanId, "stats"],
    enabled: !!artisanId,
  });

  const { data: favorites } = useQuery({
    queryKey: ["/api/favorites"],
    enabled: !!user?.id,
  });

  const favoriteProductIds = new Set(favorites?.map(p => p.id) || []);

  const inquiryForm = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      productId: "",
      subject: "",
      message: "",
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

  const onSubmitInquiry = (data: InquiryFormData) => {
    if (!artisanId) return;
    inquiryMutation.mutate({ ...data, artisanId });
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
    setContactDialogOpen(true);
  };

  const handleFollowClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to follow artisans",
        variant: "default"
      });
      return;
    }
    setFollowDialogOpen(true);
  };

  if (artisanLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-accent to-primary">
              <Skeleton className="w-full h-full" />
            </div>
            <div className="relative px-8 pb-8">
              <div className="flex items-start -mt-16 mb-6">
                <Skeleton className="w-32 h-32 rounded-full" />
                <div className="ml-6 mt-16 flex-1">
                  <Skeleton className="h-8 w-64 mb-2" />
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-4 w-80" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="p-12 text-center">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Artisan Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The artisan profile you're looking for doesn't exist.
            </p>
            <Link href="/marketplace">
              <Button>Browse Marketplace</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const artisanName = artisan.firstName && artisan.lastName
    ? `${artisan.firstName} ${artisan.lastName}`
    : 'Anonymous Artisan';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden shadow-lg">
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-r from-accent to-primary craft-pattern">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
          
          <div className="relative px-8 pb-8">
            {/* Profile Section */}
            <div className="flex flex-col md:flex-row items-start -mt-16 mb-8">
              <div className="relative">
                {artisan.profileImageUrl ? (
                  <img 
                    src={artisan.profileImageUrl}
                    alt={artisanName}
                    className="w-32 h-32 rounded-full border-4 border-card object-cover"
                    data-testid="img-artisan-avatar"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-card bg-muted flex items-center justify-center">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="md:ml-6 mt-6 md:mt-16 flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h1 className="font-serif text-2xl font-bold text-foreground" data-testid="text-artisan-name">
                        {artisanName}
                      </h1>
                      {artisan.isVerified && (
                        <Badge className="bg-secondary text-secondary-foreground">
                          Verified Artisan
                        </Badge>
                      )}
                    </div>
                    {artisan.location && (
                      <p className="text-muted-foreground mb-2 flex items-center" data-testid="text-artisan-location">
                        <MapPin className="h-4 w-4 mr-1" />
                        {artisan.location}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground space-x-4">
                      {stats && (
                        <>
                          <span className="flex items-center" data-testid="text-rating">
                            <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                            {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'} ({stats.totalReviews} reviews)
                          </span>
                          <span className="flex items-center" data-testid="text-products-count">
                            <Package className="h-4 w-4 text-accent-foreground mr-1" />
                            {stats.totalProducts} products
                          </span>
                        </>
                      )}
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 text-accent-foreground mr-1" />
                        Member since {new Date(artisan.createdAt!).getFullYear()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                    <Button onClick={handleContactClick} data-testid="button-contact">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" onClick={handleFollowClick} data-testid="button-follow">
                      <Heart className="h-4 w-4 mr-2" />
                      Follow Artisan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bio and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4">About {artisan.firstName || 'This Artisan'}</h2>
                
                {artisan.bio ? (
                  <div className="prose max-w-none">
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-artisan-bio">
                      {artisan.bio}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    This artisan hasn't added a bio yet.
                  </p>
                )}
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-foreground mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                      {stats && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Products</span>
                            <span className="text-foreground font-medium" data-testid="stat-products">
                              {stats.totalProducts}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Reviews</span>
                            <span className="text-foreground font-medium" data-testid="stat-reviews">
                              {stats.totalReviews}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Average Rating</span>
                            <span className="text-foreground font-medium flex items-center" data-testid="stat-average-rating">
                              <Star className="h-3 w-3 text-yellow-400 mr-1 fill-current" />
                              {stats.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Inquiries</span>
                            <span className="text-foreground font-medium" data-testid="stat-inquiries">
                              {stats.totalInquiries}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Contact Info */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-medium text-foreground mb-4">Connect</h3>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="text-muted-foreground block">Response Time</span>
                        <span className="text-foreground">Usually within 24 hours</span>
                      </div>
                      {artisan.location && (
                        <div className="text-sm">
                          <span className="text-muted-foreground block">Ships From</span>
                          <span className="text-foreground">{artisan.location}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Products Section */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {artisan.firstName}'s Creations
            </h2>
            <p className="text-muted-foreground">
              {artisanProducts?.length || 0} products
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsLoading ? (
              Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="bg-card rounded-xl overflow-hidden shadow-sm">
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
            ) : artisanProducts?.length ? (
              artisanProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorited={favoriteProductIds.has(product.id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Products Yet</h3>
                <p className="text-muted-foreground">
                  This artisan hasn't listed any products yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
      
      {/* Contact Dialog */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message to {artisan.firstName}</DialogTitle>
            <DialogDescription>
              Send a direct inquiry to this artisan about their work.
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
                        placeholder="I'm interested in your work..."
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
      
      <Footer />
    </div>
  );
}
