const express = require('express');
const adsController = require('../controllers/ads.controller');
const authMiddleware = require('../middelwares/auth.middelware');

const router = express.Router();


router.post('/', adsController.createMessage);


router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.get('/', adsController.getAllMessages);
router.patch('/:id/read', adsController.markAsRead);
router.delete('/:id', adsController.deleteMessage);

module.exports = router;
