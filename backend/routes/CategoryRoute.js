const express = require('express');
const { 
    getAllCategories, 
    getCategoryById, 
    createCategory, 
    updateCategory, 
    deleteCategory,
    getProductsByCategory 
} = require('../controllers/CategoryController');
const { protect, restrict } = require('../middlewares/AuthMiddleware');

const categoryRouter = express.Router();

// Public routes
categoryRouter
    .route('/')
    .get(getAllCategories)
    .post(protect, restrict('Admin'), createCategory);

categoryRouter
    .route('/:id')
    .get(getCategoryById)
    .put(protect, restrict('Admin'), updateCategory)
    .delete(protect, restrict('Admin'), deleteCategory);

// Products in category route
categoryRouter.get('/:id/products', getProductsByCategory);

module.exports = categoryRouter;