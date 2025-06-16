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
    
    for (const product of sampleProducts) {
      await storage.createProduct(product);
    }
    
    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}
