const express = require('express');
const testimonialController = require('../controllers/testimonial.controller');
const authMiddleware = require('../middelwares/auth.middelware');

const router = express.Router();

router.post('/', testimonialController.submitTestimonial);
router.get('/approved', testimonialController.getApprovedTestimonials);


router.get('/', authMiddleware.protect, authMiddleware.restrictTo('admin'), testimonialController.getAllTestimonials);
router.patch('/:id/status', authMiddleware.protect, authMiddleware.restrictTo('admin'), testimonialController.updateStatus);
router.delete('/:id', authMiddleware.protect, authMiddleware.restrictTo('admin'), testimonialController.deleteTestimonial);

module.exports = router;
