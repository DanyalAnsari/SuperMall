const mongoose = require("mongoose");
const categories = require("../data/categories");
const products = require("../data/products");
const users = require("../data/users");
const reviews = require("../data/reviews");
const { CategoryModel } = require("../models/CategoryModel");
const { ProductModel } = require("../models/ProductModel");
const { UserModel } = require("../models/UserModel");
const { ReviewsModel } = require("../models/ReviewsModel");
const slugify = require("slugify"); // Add this at the top of your file
require("dotenv").config();
const validator = require("validator");

async function initializeDb() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data sequentially to ensure complete deletion
    console.log("Clearing existing data...");
    await CategoryModel.deleteMany({});
    await ProductModel.deleteMany({});
    await UserModel.deleteMany({});
    await ReviewsModel.deleteMany({});
    console.log("Cleared existing data");

    // Add a small delay to ensure deletion is complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate slugs for categories
    const categoriesWithSlugs = categories.map((category) => ({
      ...category,
      slug: slugify(category.name, { lower: true, strict: true }),
    }));

    // Insert categories - handle potential duplicates
    try {
      const savedCategories = await CategoryModel.insertMany(
        categoriesWithSlugs,
        { ordered: false }
      );
      console.log("Categories inserted:", savedCategories.length);

      // Create category map for products
      const categoryMap = savedCategories.reduce((map, category) => {
        map[category.name] = category._id;
        return map;
      }, {});

      // Insert users
      const savedUsers = await UserModel.insertMany(users);
      console.log("Users inserted:", savedUsers.length);

      // Find vendor IDs
      const vendors = savedUsers.filter((user) => user.role === "Vendor");

      // Prepare products with proper references and slugs
      const productsWithRefs = products.map((product, index) => ({
        ...product,
        slug:
          slugify(product.name, { lower: true, strict: true }) + `-${index}`,
        category: categoryMap[product.category] || savedCategories[0]._id, // Fallback to first category if not found
        vendor: vendors[Math.floor(Math.random() * vendors.length)]._id,
        featured: Math.random() < 0.5, // Correctly generate random boolean
        bestseller: Math.random() < 0.3 // Make ~30% of products bestsellers
      }));

      // Insert products
      const savedProducts = await ProductModel.insertMany(productsWithRefs);
      console.log("Products inserted:", savedProducts.length);
      
      // Log how many bestsellers were created
      const bestsellerCount = savedProducts.filter(p => p.bestseller).length;
      console.log(`Bestseller products: ${bestsellerCount}/${savedProducts.length} (${Math.round(bestsellerCount/savedProducts.length*100)}%)`);

      if (savedProducts.length > 0) {
        console.log("First product ID:", savedProducts[0]?._id);
      }

      // Create reviews with proper references
      const reviewsWithRefs = [];
      let reviewIndex = 0;
      for (const product of savedProducts) {
        const customer = savedUsers.find((u) => u.role === "Customer");
        if (!customer) {
          console.warn("No customer found, skipping reviews for this product");
          continue;
        }

        const review = reviews[reviewIndex % reviews.length]; // Cycle through reviews
        reviewsWithRefs.push({
          ...review,
          product: product._id,
          user: customer._id,
        });
        reviewIndex++;
      }

      try {
        const insertedReviews = await ReviewsModel.insertMany(reviewsWithRefs, {
          ordered: false,
        });
        console.log("Reviews inserted:", insertedReviews.length);
      } catch (error) {
        if (error.code === 11000) {
          console.warn("Some duplicate reviews were skipped");
        } else {
          console.error("Error inserting reviews:", error.message);
        }
      }

      console.log("Database initialization completed successfully");
    } catch (error) {
      if (error.code === 11000) {
        console.warn(
          "Duplicate entries detected but continuing with the initialization process"
        );
        // Continue with the rest of the initialization process
      } else {
        throw error; // Re-throw other errors
      }
    }

    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

module.exports = initializeDb;

initializeDb();
