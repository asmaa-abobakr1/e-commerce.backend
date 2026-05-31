const express = require('express');
const subCategoryController = require('../controllers/subcategory.controller');
const authMiddleware = require('../middelwares/auth.middelware');

const router = express.Router();

router.get('/', subCategoryController.getAllSubCategories);


router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.post('/', subCategoryController.createSubCategory);
router.patch('/:id', subCategoryController.updateSubCategory);
router.delete('/:id', subCategoryController.deleteSubCategory);

module.exports = router;
