const express = require('express');
const cartController = require('../controllers/cart.controller');
const authMiddleware = require('../middelwares/auth.middelware');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/', cartController.getCart);
router.patch('/', cartController.updateCart);

module.exports = router;
