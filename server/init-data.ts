import { storage } from "./storage";

// Initialize some default categories
async function initializeData() {
  try {
    console.log("Initializing default data...");
    
    // Check if categories already exist
    const existingCategories = await storage.getCategories();
    
    if (existingCategories.length === 0) {
      console.log("Creating default categories...");
      
      const defaultCategories = [
        { name: "Pottery & Ceramics", description: "Handcrafted pottery, vases, bowls, and ceramic art" },
        { name: "Textiles & Fabrics", description: "Handwoven fabrics, embroidery, and textile art" },
        { name: "Jewelry & Accessories", description: "Handmade jewelry, bags, and fashion accessories" },
        { name: "Wood & Furniture", description: "Wooden crafts, furniture, and carpentry work" },
        { name: "Metalwork", description: "Metal crafts, sculptures, and decorative items" },
        { name: "Art & Paintings", description: "Original paintings, drawings, and artistic creations" },
        { name: "Home Decor", description: "Decorative items for home and living spaces" },
        { name: "Traditional Crafts", description: "Cultural and traditional handicrafts" }
      ];
      
      for (const category of defaultCategories) {
        await storage.createCategory(category);
        console.log(`Created category: ${category.name}`);
      }
      
      console.log("Default categories created successfully!");
    } else {
      console.log(`Found ${existingCategories.length} existing categories.`);
    }
    
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

// Run if called directly
if (require.main === module) {
  initializeData().then(() => {
    console.log("Data initialization complete.");
    process.exit(0);
  }).catch((error) => {
    console.error("Data initialization failed:", error);
    process.exit(1);
  });
}

export { initializeData };
