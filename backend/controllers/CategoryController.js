const { CategoryModel } = require("../models/CategoryModel");
const { ProductModel } = require("../models/ProductModel");
const asyncErrorHandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomError");
const ApiFeatures = require("../utils/ApiFeatures");
const { sendSuccessResponse } = require("../utils/Utilities");

const getAllCategories = asyncErrorHandler(async (req, res, next) => {
  const features = new ApiFeatures(CategoryModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute queries concurrently
  const [categories, totalCategories] = await Promise.all([
    features.query.populate('subcategories', 'name slug icon'),
    CategoryModel.countDocuments(features.queryObj)
  ]);

  sendSuccessResponse(res, 200, {
    categories,
    pagination: {
      total: totalCategories,
      page: features.page || 1,
      pages: Math.ceil(totalCategories / (features.limit || 10))
    }
  });
});

const getCategoryById = asyncErrorHandler(async (req, res, next) => {
  const category = await CategoryModel.findById(req.params.id)
    .populate('subcategories', 'name slug icon');

  if (!category) {
    return next(new CustomError("Category not found", 404));
  }

  sendSuccessResponse(res, 200, { category });
});

const createCategory = asyncErrorHandler(async (req, res, next) => {
  const { name, description, parent_category, icon, isActive } = req.body;

  // Validate parent category if provided
  if (parent_category) {
    const parentExists = await CategoryModel.findById(parent_category);
    if (!parentExists) {
      return next(new CustomError("Parent category not found", 404));
    }
    if (!parentExists.isActive) {
      return next(new CustomError("Parent category is inactive", 400));
    }
  }

  const category = await CategoryModel.create({
    name,
    description,
    parent_category,
    icon,
    isActive: isActive ?? true
  });

  // Populate subcategories virtual
  await category.populate('subcategories', 'name slug icon');

  sendSuccessResponse(res, 201, { category });
});

const updateCategory = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  // Find category first
  const category = await CategoryModel.findById(id);
  if (!category) {
    return next(new CustomError("Category not found", 404));
  }

  // Prevent circular reference
  if (updates.parent_category) {
    if (updates.parent_category.toString() === id) {
      return next(new CustomError("Category cannot be its own parent", 400));
    }

    const parentCategory = await CategoryModel.findById(updates.parent_category);
    if (!parentCategory) {
      return next(new CustomError("Parent category not found", 404));
    }
    if (!parentCategory.isActive) {
      return next(new CustomError("Cannot set inactive category as parent", 400));
    }
  }

  const updatedCategory = await CategoryModel.findByIdAndUpdate(
    id,
    updates,
    { new: true, runValidators: true }
  ).populate('subcategories', 'name slug icon');

  sendSuccessResponse(res, 200, { category: updatedCategory });
});

const deleteCategory = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await CategoryModel.findById(id);
  if (!category) {
    return next(new CustomError("Category not found", 404));
  }

  // Check dependencies
  const [productCount, subCategoryCount] = await Promise.all([
    ProductModel.countDocuments({ category: id }),
    CategoryModel.countDocuments({ parent_category: id })
  ]);

  if (productCount > 0) {
    return next(
      new CustomError(
        `Cannot delete category with ${productCount} products. Move or delete products first.`,
        400
      )
    );
  }

  if (subCategoryCount > 0) {
    return next(
      new CustomError(
        `Cannot delete category with ${subCategoryCount} subcategories. Update or delete subcategories first.`,
        400
      )
    );
  }

  await category.deleteOne();

  sendSuccessResponse(res, 200, {
    message: "Category deleted successfully"
  });
});

const getProductsByCategory = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const category = await CategoryModel.findById(id);
  if (!category) {
    return next(new CustomError("Category not found", 404));
  }

  // Get all subcategories
  const subcategories = await CategoryModel.find({ parent_category: id })
    .select('_id');
  
  const categoryIds = [id, ...subcategories.map(sub => sub._id)];

  const features = new ApiFeatures(
    ProductModel.find({ category: { $in: categoryIds } }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const [products, totalProducts] = await Promise.all([
    features.query.populate('vendor', 'name'),
    ProductModel.countDocuments({ category: { $in: categoryIds } })
  ]);

  sendSuccessResponse(res, 200, {
    category: {
      id: category._id,
      name: category.name,
      description: category.description,
      slug: category.slug,
      icon: category.icon
    },
    products,
    pagination: {
      total: totalProducts,
      page: features.page || 1,
      pages: Math.ceil(totalProducts / (features.limit || 10))
    }
  });
});

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getProductsByCategory
};
