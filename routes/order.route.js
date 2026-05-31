const express = require('express');
const orderController = require('../controllers/order.controller');
const authMiddleware = require('../middelwares/auth.middelware');

const router = express.Router();

router.use(authMiddleware.protect);

router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.patch('/:id/cancel', orderController.cancelOrder);
router.patch('/:id/refund-request', orderController.requestRefund);
router.get('/:id', authMiddleware.restrictTo('admin'), orderController.getOrderById);


router.get('/', authMiddleware.restrictTo('admin'), orderController.getAllOrders);
router.patch('/:id/status', authMiddleware.restrictTo('admin'), orderController.updateOrderStatus);
router.patch('/:id/refund-approve', authMiddleware.restrictTo('admin'), orderController.approveRefund);
router.delete('/:id', authMiddleware.restrictTo('admin'), orderController.deleteOrder);

module.exports = router;
