const express = require('express');
const { protect, restrict } = require('../middlewares/AuthMiddleware');
const { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, getProductsByVendor } = require('../controllers/ProductController');
const productRouter = express.Router();

// Public routes
productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProduct);


// Protected routes (vendors/admin only)
productRouter.use(protect);
productRouter.use(restrict('Vendor', 'Admin'));

productRouter.post('/', createProduct);
productRouter.patch('/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);
productRouter.get('/vendor/vendor:id', getProductsByVendor)

module.exports=productRouter