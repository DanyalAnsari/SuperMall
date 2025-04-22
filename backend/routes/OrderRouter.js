const express=require('express')
const { createOrder, getUserOrders, getOrderById, updateOrderPayment, updateOrderStatus, getVendorOrders, getAllOrders } = require('../controllers/OrderController')
const { protect, restrict } = require('../middlewares/AuthMiddleware')
const OrderRouter=express.Router()

OrderRouter.use(protect)
OrderRouter.post('/', createOrder)
OrderRouter.get('/my', getUserOrders)
OrderRouter.get('/:id', getOrderById)
OrderRouter.put('/:id/pay', updateOrderPayment)
OrderRouter.put('/:id/status',restrict('Admin', 'Vendor') ,updateOrderStatus)
OrderRouter.get('/',restrict('Admin'), getAllOrders)
OrderRouter.get('/vendor',restrict('Vendor') ,getVendorOrders)

module.exports=OrderRouter