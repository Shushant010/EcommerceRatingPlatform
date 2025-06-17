import { storage } from "./storage";
import type { InsertProduct } from "@shared/schema";


const sampleProducts: InsertProduct[] = [
  {
    name: "Premium Wireless Headphones",
    description: "High-quality noise-canceling headphones with premium sound quality. Features include wireless connectivity, 30-hour battery life, and comfortable over-ear design perfect for long listening sessions.",
    price: "299.99",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    category: "Electronics"
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitoring, GPS, waterproof design, and smart notifications. Perfect companion for your active lifestyle with 7-day battery life.",
    price: "199.99",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    category: "Electronics"
  },
  {
    name: "Professional Laptop",
    description: "High-performance laptop for professionals and students. Features Intel i7 processor, 16GB RAM, 512GB SSD, and stunning 15.6-inch display. Perfect for work, coding, and multimedia.",
    price: "1299.99",
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    category: "Electronics"
  },
  {
    name: "Latest Smartphone",
    description: "Cutting-edge smartphone with advanced camera features, 5G connectivity, 128GB storage, and all-day battery life. Capture life's moments with professional-quality photos.",
    price: "899.99",
    imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    category: "Electronics"
  },
  {
    name: "Ergonomic Gaming Chair",
    description: "Comfortable gaming chair with adjustable lumbar support, premium leather upholstery, and 360-degree swivel. Designed for long gaming sessions with maximum comfort and style.",
    price: "349.99",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    category: "Furniture"
  },
  {
    name: "Wireless Bluetooth Speaker",
    description: "Portable speaker with 360-degree sound and waterproof design. Features 12-hour battery life, deep bass, crystal-clear highs, and seamless Bluetooth connectivity.",
    price: "129.99",
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    category: "Electronics"
  },
  {
    name: "Professional Tablet",
    description: "Versatile tablet with stylus support for creative work. Features 12.9-inch display, powerful processor, all-day battery, and compatibility with professional apps.",
    price: "649.99",
    imageUrl: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    category: "Electronics"
  },
  {
    name: "Premium Coffee Maker",
    description: "Automatic espresso machine with built-in grinder. Features programmable settings, milk frother, and premium stainless steel construction for café-quality coffee at home.",
    price: "599.99",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    category: "Kitchen"
  },
  {
    name: "Advanced Fitness Tracker",
    description: "Comprehensive health monitoring with sleep tracking, heart rate zones, stress management, and 50+ workout modes. Lightweight design with 7-day battery life.",
    price: "149.99",
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    category: "Electronics"
  },
  {
    name: "LED Desk Lamp",
    description: "Adjustable LED lamp with wireless charging base. Features touch controls, multiple brightness levels, color temperature adjustment, and modern minimalist design.",
    price: "89.99",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600",
    category: "Home & Office"
  }
];



export async function seedDatabase() {
  try {
    console.log("Seeding database with sample products...");

    // Fetch existing products and add only new ones
    const existingProducts = await storage.getAllProducts();
    const existingNames = new Set(existingProducts.map(p => p.name));
    const productsToAdd = sampleProducts.filter(p => !existingNames.has(p.name));
    for (const p of productsToAdd) {
      await storage.createProduct(p);
    }
    console.log(`${productsToAdd.length} products added (skipped ${sampleProducts.length - productsToAdd.length} duplicates).`);

    // Create sample users if not exist
    console.log("Seeding database with sample users...");
    const sampleUsers = [
      { username: "john_reviewer", email: "john@example.com", password: "password123" },
      { username: "sarah_buyer", email: "sarah@example.com", password: "password123" },
      { username: "mike_tech", email: "mike@example.com", password: "password123" },
      { username: "lisa_shopper", email: "lisa@example.com", password: "password123" },
      { username: "david_user", email: "david@example.com", password: "password123" }
    ];
    for (const u of sampleUsers) {
      const existing = await storage.getUserByEmail(u.email);
      if (!existing) {
        await storage.createUser(u);
      }
    }

    // Create sample reviews (duplicates skipped via error)
    console.log("Seeding database with sample reviews...");
   
    const sampleReviews = [
      { userId: 1, productId: 1, rating: 5, title: "Amazing sound quality!", content: "These headphones exceeded my expectations. The noise cancellation is fantastic and the battery life is exactly as advertised. Highly recommend for anyone looking for premium audio experience." },
      { userId: 2, productId: 1, rating: 4, title: "Great headphones, minor issues", content: "Overall very satisfied with the purchase. Sound quality is excellent, but the headband could be more comfortable for extended use. Still a solid 4-star product." },
      { userId: 3, productId: 2, rating: 5, title: "Perfect fitness companion", content: "This watch has transformed my workout routine. GPS is accurate, heart rate monitoring is spot on, and the battery easily lasts a full week. Worth every penny!" },
      { userId: 4, productId: 2, rating: 4, title: "Good fitness tracker", content: "Does everything I need for tracking my workouts and daily activity. The sleep tracking feature is particularly useful. Only wish the screen was slightly larger." },
      { userId: 1, productId: 3, rating: 5, title: "Excellent laptop for work", content: "Perfect for my development work. Fast processor, plenty of RAM, and the display is crisp and clear. Build quality feels premium and it handles all my programming tasks effortlessly." },
      { userId: 5, productId: 3, rating: 4, title: "Solid performance laptop", content: "Great laptop for professional use. Fast boot times, excellent keyboard, and runs all my applications smoothly. The only downside is it gets a bit warm during intensive tasks." },
      { userId: 2, productId: 4, rating: 5, title: "Best smartphone I've owned", content: "The camera quality is incredible, especially for night photos. 5G connectivity is blazing fast and the battery easily lasts all day with heavy usage. Highly recommend!" },
      { userId: 3, productId: 5, rating: 4, title: "Comfortable gaming chair", content: "Very comfortable for long gaming sessions. The lumbar support is excellent and the adjustability is great. Only minor complaint is assembly took longer than expected." },
      { userId: 4, productId: 6, rating: 5, title: "Amazing portable speaker", content: "Sound quality is incredible for such a compact size. Waterproof design is perfect for beach trips. Battery life is excellent and Bluetooth connection is very stable." },
      { userId: 5, productId: 7, rating: 4, title: "Great tablet for creative work", content: "Perfect for digital art and note-taking. The stylus is responsive and the display colors are accurate. Would be 5 stars if it came with the stylus included." }
    ];
    
    for (const r of sampleReviews) {
      try {
        await storage.createReview(r);
      } catch {
        // assume duplicate, skip
      }
    }

    console.log("Database seeded successfully (duplicates skipped).");
  } catch (err) {
    console.error("Error during seeding:", err);
  }
}

// Auto-run when file executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}



