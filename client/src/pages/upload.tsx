import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProductSchema } from "@shared/schema";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CloudUpload, Wand2, DollarSign, Tag, Megaphone, Heart, Loader2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";


const productFormSchema = insertProductSchema.extend({
  images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
  price: z.string().min(1, "Price is required"),
}).omit({
  artisanId: true,
});

type ProductFormData = z.infer<typeof productFormSchema>;

export default function Upload() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<any>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "0",
      categoryId: "",
      materials: "",
      dimensions: "",
      careInstructions: "",
      images: [],
    },
  });

  // AI pricing mutation
  const pricingMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; category: string; materials: string }) => {
      const response = await apiRequest('POST', '/api/ai/pricing', data);
      return response.json();
    },
    onSuccess: (data) => {
      form.setValue('price', data.suggestedPrice.toString());
      setAiSuggestions((prev: any) => ({ ...prev, pricing: data }));
      toast({
        title: "AI Pricing Suggestion",
        description: `Suggested price: $${data.suggestedPrice}`,
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
        description: "Failed to get AI pricing suggestion",
        variant: "destructive"
      });
    },
  });

  // AI marketing mutation
  const marketingMutation = useMutation({
    mutationFn: async (data: { title: string; description: string; category: string }) => {
      const response = await apiRequest('POST', '/api/ai/marketing', data);
      return response.json();
    },
    onSuccess: (data) => {
      setAiSuggestions((prev: any) => ({ ...prev, marketing: data }));
      toast({
        title: "AI Marketing Content Generated",
        description: "SEO title, social caption, and story version ready!",
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
        description: "Failed to generate marketing content",
        variant: "destructive"
      });
    },
  });

  // Product creation mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: data,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Product Created",
        description: "Your product has been listed successfully!",
        variant: "default"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setLocation(`/product/${data.id}`);
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
        description: "Failed to create product",
        variant: "destructive"
      });
    },
  });

  // Redirect to login if not authenticated
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive"
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    setImageFiles(prev => [...prev, ...validFiles]);
    form.setValue('images', [...imageFiles, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    form.setValue('images', newFiles);
  };

  const handleAIPricing = () => {
    const formData = form.getValues();
    const category = categories?.find((c: any) => c.id === formData.categoryId);
    
    if (!formData.title || !formData.description || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, description, and category first",
        variant: "destructive"
      });
      return;
    }

    pricingMutation.mutate({
      title: formData.title,
      description: formData.description,
      category: category.name,
      materials: formData.materials || ""
    });
  };

  const handleAIMarketing = () => {
    const formData = form.getValues();
    const category = categories?.find((c: any) => c.id === formData.categoryId);
    
    if (!formData.title || !formData.description || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in title, description, and category first",
        variant: "destructive"
      });
      return;
    }

    marketingMutation.mutate({
      title: formData.title,
      description: formData.description,
      category: category.name
    });
  };

  const applyMarketingContent = (type: 'seoTitle' | 'socialCaption' | 'storyVersion' | 'marketingDescription') => {
    if (!aiSuggestions?.marketing) return;

    switch (type) {
      case 'seoTitle':
        form.setValue('title', aiSuggestions.marketing.seoTitle);
        break;
      case 'marketingDescription':
        form.setValue('description', aiSuggestions.marketing.marketingDescription);
        break;
    }
  };

  const onSubmit = (data: ProductFormData) => {
    const formData = new FormData();
    
    // Add all form fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('categoryId', data.categoryId);
    formData.append('materials', data.materials || '');
    formData.append('dimensions', data.dimensions || '');
    formData.append('careInstructions', data.careInstructions || '');
    formData.append('aiEnhanced', aiSuggestions ? 'true' : 'false');
    formData.append('aiPricingSuggested', !!aiSuggestions?.pricing ? 'true' : 'false');
    
    if (aiSuggestions?.marketing?.seoTitle) {
      formData.append('seoTitle', aiSuggestions.marketing.seoTitle);
    }
    if (aiSuggestions?.marketing?.marketingDescription) {
      formData.append('marketingCaption', aiSuggestions.marketing.marketingDescription);
    }

    // Add image files
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    createProductMutation.mutate(formData);
  };



  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">List Your Masterpiece</h1>
          <p className="text-muted-foreground">Our AI assistant will help you optimize your listing for maximum visibility</p>
        </div>
        
        <Card>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="images"
                  render={() => (
                    <FormItem>
                      <FormLabel>Product Images</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                              id="image-upload"
                              data-testid="input-images"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <CloudUpload className="text-muted-foreground text-4xl mb-4 mx-auto h-12 w-12" />
                              <p className="text-muted-foreground mb-2">Drop your images here or click to browse</p>
                              <p className="text-xs text-muted-foreground">Support: JPG, PNG, WebP (Max 10MB each)</p>
                            </label>
                          </div>
                          
                          {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 text-xs"
                                    data-testid={`button-remove-image-${index}`}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Handwoven Ceramic Bowl" data-testid="input-title" />
                        </FormControl>
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <div className="ai-badge text-white px-2 py-1 rounded mr-2">AI</div>
                          SEO-optimized title suggestions available
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category: any) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} placeholder="Tell the story of your creation..." data-testid="textarea-description" />
                      </FormControl>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <div className="ai-badge text-white px-2 py-1 rounded mr-2">AI</div>
                          Generate compelling product story
                        </div>
                        <Button
                          type="button"
                          variant="link"
                          size="sm"
                          onClick={handleAIMarketing}
                          disabled={marketingMutation.isPending}
                          className="text-primary"
                          data-testid="button-enhance-ai"
                        >
                          {marketingMutation.isPending ? (
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          ) : (
                            <Wand2 className="mr-1 h-4 w-4" />
                          )}
                          Enhance with AI
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="materials"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Materials (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Stoneware clay, lead-free glaze" data-testid="input-materials" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensions (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 6&quot; diameter x 3&quot; height" data-testid="input-dimensions" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="careInstructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Care Instructions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={2} placeholder="e.g., Dishwasher and microwave safe" data-testid="textarea-care" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Pricing with AI */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (USD)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                            <Input {...field} type="number" step="0.01" className="pl-8" placeholder="0.00" data-testid="input-price" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      onClick={handleAIPricing}
                      disabled={pricingMutation.isPending}
                      data-testid="button-ai-pricing"
                    >
                      {pricingMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <DollarSign className="mr-2 h-4 w-4" />
                      )}
                      Get AI Price Suggestion
                    </Button>
                  </div>
                </div>
                
                {/* AI Marketing Assistant */}
                <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <div className="ai-badge text-white p-2 rounded-lg mr-3">
                        <Wand2 className="h-4 w-4" />
                      </div>
                      AI Marketing Assistant
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Generate engaging content for your product listing and social media</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                        onClick={() => applyMarketingContent('seoTitle')}
                        disabled={!aiSuggestions?.marketing}
                        data-testid="button-apply-seo-title"
                      >
                        <Tag className="h-6 w-6 text-primary" />
                        <div className="text-center">
                          <div className="font-medium text-sm">SEO Title</div>
                          <div className="text-xs text-muted-foreground">Optimize for search</div>
                        </div>
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                        disabled={!aiSuggestions?.marketing}
                        data-testid="button-social-caption"
                      >
                        <Megaphone className="h-6 w-6 text-primary" />
                        <div className="text-center">
                          <div className="font-medium text-sm">Social Caption</div>
                          <div className="text-xs text-muted-foreground">Instagram ready</div>
                        </div>
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                        onClick={() => applyMarketingContent('marketingDescription')}
                        disabled={!aiSuggestions?.marketing}
                        data-testid="button-apply-story"
                      >
                        <Heart className="h-6 w-6 text-primary" />
                        <div className="text-center">
                          <div className="font-medium text-sm">Story Version</div>
                          <div className="text-xs text-muted-foreground">Emotional appeal</div>
                        </div>
                      </Button>
                    </div>
                    
                    {/* Display AI suggestions */}
                    {aiSuggestions?.marketing && (
                      <div className="bg-card rounded-lg p-4 space-y-3">
                        <div>
                          <h4 className="text-sm font-medium mb-1">SEO Title:</h4>
                          <p className="text-sm text-muted-foreground">{aiSuggestions.marketing.seoTitle}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Social Caption:</h4>
                          <p className="text-sm text-muted-foreground">{aiSuggestions.marketing.socialCaption}</p>
                        </div>
                      </div>
                    )}
                    
                    {aiSuggestions?.pricing && (
                      <div className="bg-card rounded-lg p-4 mt-4">
                        <h4 className="text-sm font-medium mb-2">AI Pricing Analysis:</h4>
                        <p className="text-sm text-muted-foreground mb-2">{aiSuggestions.pricing.reasoning}</p>
                        <p className="text-sm">
                          Suggested range: ${aiSuggestions.pricing.priceRange.min} - ${aiSuggestions.pricing.priceRange.max}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Submit Buttons */}
                <div className="flex gap-4">
                  <Button type="button" variant="outline" className="flex-1" data-testid="button-save-draft">
                    Save as Draft
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={createProductMutation.isPending}
                    data-testid="button-list-product"
                  >
                    {createProductMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        List Product
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}


