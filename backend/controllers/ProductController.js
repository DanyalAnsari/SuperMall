const { CategoryModel } = require("../models/CategoryModel");
const { ProductModel } = require("../models/ProductModel");
const { UserModel } = require("../models/UserModel");
const asyncErrorhandler = require("../utils/AsyncErrorHandler");
const CustomError = require("../utils/CustomError");
const ApiFeatures = require("../utils/ApiFeatures");
const { filterReqObj } = require("../utils/Utilities");
const { sendSuccessResponse } = require("../utils/Utilities");

const getAllProducts = asyncErrorhandler(async (req, res, next) => {
  // Handle text search
  if (req.query.search) {
    req.query.$text = { $search: req.query.search };
    delete req.query.search;
  }

  const features = new ApiFeatures(ProductModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const [products, totalProducts] = await Promise.all([
    features.query
      .populate("category", "name slug")
      .populate("vendor", "name email"),
    ProductModel.countDocuments(features.queryObj),
  ]);

  sendSuccessResponse(res, 200, {
    pagination: {
      total: totalProducts,
      page: features.page || 1,
      pages: Math.ceil(totalProducts / (features.limit || 10)),
    },
    products,
  });
});

const getProduct = asyncErrorhandler(async (req, res, next) => {
  const product = await ProductModel.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
  })
    .populate("category", "name slug")
    .populate("vendor", "name email");

  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  sendSuccessResponse(res, 200, {
    product,
    inStock: product.inStock,
    discountPercentage: product.discountPercentage,
  });
});

const createProduct = asyncErrorhandler(async (req, res, next) => {
  const allowedFields = [
    "name",
    "description",
    "price",
    "discountedPrice",
    "stock",
    "category",
    "images",
    "specifications",
    "tags",
    "isActive",
  ];

  const productData = filterReqObj(req.body, allowedFields);

  // Validate category
  // console.log(productData);

  const categoryExists = await CategoryModel.findById(productData.category);
  if (!categoryExists) {
    return next(new CustomError("Invalid category", 400));
  }

  // Validate discounted price
  if (productData.discountedPrice >= productData.price) {
    return next(
      new CustomError("Discounted price must be less than regular price", 400)
    );
  }

  // Create product with current user as vendor
  const product = await ProductModel.create({
    ...productData,
    vendor: req.user.id,
  });

  await product.populate([
    { path: "category", select: "name slug" },
    { path: "vendor", select: "name email" },
  ]);

  sendSuccessResponse(res, 201, { product });
});

const updateProduct = asyncErrorhandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await ProductModel.findById(id);

  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  // Check authorization
  if (req.user.role !== "Admin" && product.vendor.toString() !== req.user.id) {
    return next(new CustomError("Not authorized to update this product", 403));
  }

  const allowedFields = [
    "name",
    "description",
    "price",
    "discountedPrice",
    "stock",
    "category",
    "images",
    "specifications",
    "tags",
    "isActive",
  ];

  const updates = filterReqObj(req.body, allowedFields);

  // Validate category if being updated
  if (updates.category) {
    const categoryExists = await CategoryModel.findById(updates.category);
    if (!categoryExists) {
      return next(new CustomError("Invalid category", 400));
    }
  }

  // Validate discounted price
  if (
    updates.discountedPrice &&
    updates.discountedPrice >= (updates.price || product.price)
  ) {
    return next(
      new CustomError("Discounted price must be less than regular price", 400)
    );
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).populate([
    { path: "category", select: "name slug" },
    { path: "vendor", select: "name email" },
  ]);

  sendSuccessResponse(res, 200, {
    product: updatedProduct,
    inStock: updatedProduct.inStock,
    discountPercentage: updatedProduct.discountPercentage,
  });
});

const deleteProduct = asyncErrorhandler(async (req, res, next) => {
  const productId = req.params.id;

  // Find product first
  const product = await ProductModel.findById(productId);

  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  // Check if user is owner or admin
  if (
    req.user.role !== "Admin" &&
    product.vendor.toString() === product.vendor
  ) {
    return next(new CustomError("Not authorized to delete this product", 403));
  }

  await ProductModel.findByIdAndDelete(productId);

  sendSuccessResponse(res, 200, { message: "Product deleted successfully" });
});

const getProductsByVendor = asyncErrorhandler(async (req, res, next) => {
  const vendorId = req.params.vendorId;

  // Check if vendor exists
  const vendor = await UserModel.findOne({ _id: vendorId, role: "vendor" });
  if (!vendor) {
    return next(new CustomError("Vendor not found", 404));
  }

  // Create feature object
  const features = new ApiFeatures(
    ProductModel.find({ vendor: vendorId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute query
  const products = await features.query.populate("category", "name");

  // Get total count for pagination
  const totalProducts = await ProductModel.countDocuments({ vendor: vendorId });

  // Calculate pagination info
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;

  sendSuccessResponse(res, 200, {
    pagination: {
      total: totalProducts,
      page,
      pages: Math.ceil(totalProducts / limit),
    },
    vendor: {
      id: vendor._id,
      name: `${vendor.firstName} ${vendor.lastName}`,
    },
    products,
  });
});

const updateProductStock = asyncErrorhandler(async (req, res, next) => {
  const { stock } = req.body;
  const productId = req.params.id;

  if (stock === undefined || stock < 0) {
    return next(new CustomError("Valid stock quantity required", 400));
  }

  const product = await ProductModel.findById(productId);

  if (!product) {
    return next(new CustomError("Product not found", 404));
  }

  // Check if user is owner or admin
  if (product.vendor.toString() !== req.user.id && req.user.role !== "Admin") {
    return next(new CustomError("Not authorized to update this product", 403));
  }

  product.stock = stock;
  product.updatedAt = Date.now();
  await product.save();

  sendSuccessResponse(res, 200, {
    product: {
      id: product._id,
      name: product.name,
      stock: product.stock,
    },
  });
});

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByVendor,
  updateProductStock,
};
