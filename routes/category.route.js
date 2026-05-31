const express = require('express');
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middelwares/auth.middelware');

const router = express.Router();

router.get('/', categoryController.getAllCategories);


router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.post('/', categoryController.createCategory);
router.patch('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
