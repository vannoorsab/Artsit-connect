import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

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

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a pricing expert for handmade artisan products. Provide realistic pricing suggestions based on materials, craftsmanship, and market positioning."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
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
    throw new Error("Failed to generate pricing suggestion: " + error.message);
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

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a marketing copywriter specializing in handmade artisan products. Create compelling, authentic content that resonates with buyers of handcrafted goods."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error("Failed to generate marketing content: " + error.message);
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

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a storytelling expert who helps artisans tell their craft stories in compelling ways that connect with customers while maintaining authenticity."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error("Failed to enhance artisan story: " + error.message);
  }
}

export async function analyzeProductImage(base64Image: string): Promise<{
  suggestions: string[];
  detectedMaterials: string[];
  styleAnalysis: string;
  improvementTips: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this artisan product image and provide insights for the seller. Focus on:
              - Materials and craftsmanship visible in the image
              - Style and aesthetic analysis
              - Photography and presentation suggestions
              - Marketing and listing improvement tips
              
              Respond in JSON format with:
              {
                "suggestions": ["suggestion1", "suggestion2"],
                "detectedMaterials": ["material1", "material2"],
                "styleAnalysis": "description of style and aesthetic",
                "improvementTips": ["tip1", "tip2", "tip3"]
              }`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 2048,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error("Failed to analyze product image: " + error.message);
  }
}
