const mongoose = require('mongoose');
const categories = require('../data/categories');
const products = require('../data/products');
const users = require('../data/users');
const reviews = require('../data/reviews');
const { CategoryModel } = require('../models/CategoryModel');
const { ProductModel } = require('../models/ProductModel');
const { UserModel } = require('../models/UserModel');
const { ReviewsModel } = require('../models/ReviewsModel');
const slugify = require('slugify'); // Add this at the top of your file
require('dotenv').config();
const validator = require('validator');

async function initializeDb() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      CategoryModel.deleteMany({}),
      ProductModel.deleteMany({}),
      UserModel.deleteMany({}),
      ReviewsModel.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Generate slugs for categories
    const categoriesWithSlugs = categories.map((category, index) => ({
      ...category,
      slug: slugify(category.name, { lower: true, strict: true }) + `-${index}`
    }));

    // Insert categories
    const savedCategories = await CategoryModel.insertMany(categoriesWithSlugs);
    console.log('Categories inserted');

    // Create category map for products
    const categoryMap = savedCategories.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    // Insert users
    const savedUsers = await UserModel.insertMany(users);
    console.log('Users inserted');

    // Find vendor IDs
    const vendors = savedUsers.filter(user => user.role === 'Vendor');

    // Prepare products with proper references and slugs
    const productsWithRefs = products.map((product, index) => ({
      ...product,
      slug: slugify(product.name, { lower: true, strict: true }) + `-${index}`,
      category: categoryMap[product.category],
      vendor: vendors[Math.floor(Math.random() * vendors.length)]._id
    }));

    // Insert products
    const savedProducts = await ProductModel.insertMany(productsWithRefs);
    console.log('Products inserted');

    console.log("First product ID:", savedProducts[0]?._id);

    // Create reviews with proper references
    const reviewsWithRefs = [];
    let reviewIndex = 0;
    for (const product of savedProducts) {
      const customer = savedUsers.find(u => u.role === 'Customer');
      if (!customer) {
        console.warn("No customer found, skipping reviews for this product");
        continue;
      }

      const review = reviews[reviewIndex % reviews.length]; // Cycle through reviews
      reviewsWithRefs.push({
        ...review,
        product: product._id,
        user: customer._id
      });
      reviewIndex++;
    }

    try {
      await ReviewsModel.insertMany(reviewsWithRefs);
      console.log('Reviews inserted');
    } catch (error) {
      if (error.code === 11000) {
        console.error("Duplicate key error during review insertion:", error.message);
      } else {
        console.error("Error inserting reviews:", error);
      }
    }

    console.log('Database initialization completed');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDb();