import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "default_key");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface PricingSuggestion {
  suggestedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  reasoning: string;
  marketFactors: string[];
}

export interface MarketingContent {
  seoTitle: string;
  socialCaption: string;
  storyVersion: string;
  marketingDescription: string;
}

export interface ArtisanStoryEnhancement {
  enhancedBio: string;
  craftStory: string;
  inspirationSources: string[];
  uniqueSellingPoints: string[];
}

export async function generatePricingSuggestion(
  productTitle: string,
  description: string,
  category: string,
  materials: string
): Promise<PricingSuggestion> {
  try {
    const prompt = `Analyze this handmade artisan product and suggest pricing:
    
Product: ${productTitle}
Description: ${description}
Category: ${category}
Materials: ${materials}

Consider factors like:
- Materials cost and quality
- Time investment for handmade items
- Market positioning for artisan goods
- Category-specific pricing trends
- Value perception for handcrafted items

Provide a JSON response with:
{
  "suggestedPrice": number,
  "priceRange": {"min": number, "max": number},
  "reasoning": "explanation of pricing rationale",
  "marketFactors": ["factor1", "factor2", "factor3"]
}`;

    const fullPrompt = `You are a pricing expert for handmade artisan products. Provide realistic pricing suggestions based on materials, craftsmanship, and market positioning.

${prompt}

Please respond with valid JSON only, no additional text.`;

    const response = await model.generateContent(fullPrompt);
    const content = response.response.text();
    if (!content) {
      throw new Error('No content received from Gemini API');
    }

    // Clean the response to ensure it's valid JSON
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    const result = JSON.parse(cleanContent);
    return {
      suggestedPrice: Math.max(10, result.suggestedPrice),
      priceRange: {
        min: Math.max(5, result.priceRange.min),
        max: result.priceRange.max
      },
      reasoning: result.reasoning,
      marketFactors: result.marketFactors
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error("Failed to generate pricing suggestion: " + errorMessage);
  }
}

export async function generateMarketingContent(
  productTitle: string,
  description: string,
  category: string,
  artisanName: string
): Promise<MarketingContent> {
  try {
    const prompt = `Create marketing content for this artisan product:

Product: ${productTitle}
Description: ${description}
Category: ${category}
Artisan: ${artisanName}

Generate compelling marketing content that highlights:
- Handmade craftsmanship value
- Unique artisan story elements
- SEO-friendly keywords
- Emotional connection points
- Social media appeal

Provide JSON response with:
{
  "seoTitle": "SEO-optimized title with relevant keywords",
  "socialCaption": "Instagram-ready caption with hashtags",
  "storyVersion": "Emotional storytelling version emphasizing craft",
  "marketingDescription": "Compelling product description for listings"
}`;

    const fullPrompt = `You are a marketing copywriter specializing in handmade artisan products. Create compelling, authentic content that resonates with buyers of handcrafted goods.

${prompt}

Please respond with valid JSON only, no additional text.`;

    const response = await model.generateContent(fullPrompt);
    const content = response.response.text();
    if (!content) {
      throw new Error('No content received from Gemini API');
    }

    // Clean the response to ensure it's valid JSON
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanContent);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error("Failed to generate marketing content: " + errorMessage);
  }
}

export async function enhanceArtisanStory(
  currentBio: string,
  craftType: string,
  location: string,
  experience: string
): Promise<ArtisanStoryEnhancement> {
  try {
    const prompt = `Enhance this artisan's story and profile:

Current Bio: ${currentBio}
Craft Type: ${craftType}
Location: ${location}
Experience: ${experience}

Create an enhanced artisan story that:
- Maintains authenticity while improving storytelling
- Highlights unique aspects of their craft journey
- Creates emotional connection with potential buyers
- Emphasizes artisan expertise and passion
- Includes inspiration sources and creative process

Provide JSON response with:
{
  "enhancedBio": "Improved version of the bio with better storytelling",
  "craftStory": "Detailed story about their craft journey and techniques",
  "inspirationSources": ["source1", "source2", "source3"],
  "uniqueSellingPoints": ["point1", "point2", "point3"]
}`;

    const fullPrompt = `You are a storytelling expert who helps artisans tell their craft stories in compelling ways that connect with customers while maintaining authenticity.

${prompt}

Please respond with valid JSON only, no additional text.`;

    const response = await model.generateContent(fullPrompt);
    const content = response.response.text();
    if (!content) {
      throw new Error('No content received from Gemini API');
    }

    // Clean the response to ensure it's valid JSON
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanContent);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error("Failed to enhance artisan story: " + errorMessage);
  }
}

export async function analyzeProductImage(base64Image: string): Promise<{
  suggestions: string[];
  detectedMaterials: string[];
  styleAnalysis: string;
  improvementTips: string[];
}> {
  try {
    // For now, we'll provide general suggestions since Gemini image analysis requires different setup
    // In a production environment, you would configure Gemini Pro Vision for image analysis
    const prompt = `Based on typical artisan product analysis, provide general insights for handmade product sellers.

Respond in JSON format with:
{
  "suggestions": ["Focus on good lighting for photos", "Show multiple angles of your product", "Include scale references"],
  "detectedMaterials": ["wood", "fabric", "metal", "ceramic"],
  "styleAnalysis": "Handcrafted artisan piece with attention to detail and traditional techniques",
  "improvementTips": ["Use natural lighting", "Clean background", "Show product in use", "Highlight unique details"]
}

Please respond with valid JSON only, no additional text.`;

    const response = await model.generateContent(prompt);
    const content = response.response.text();
    if (!content) {
      throw new Error('No content received from Gemini API');
    }

    // Clean the response to ensure it's valid JSON
    const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanContent);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error("Failed to analyze product image: " + errorMessage);
  }
}
