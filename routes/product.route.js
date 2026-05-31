const express = require('express');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middelwares/auth.middelware');
const upload = require('../middelwares/upload.middelware');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);


router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.post('/', upload.single('img'), productController.createProduct);
router.patch('/:id', upload.single('img'), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
