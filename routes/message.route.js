const express = require('express');
const messageController = require('../controllers/message.controller');
const authMiddleware = require('../middelwares/auth.middelware');

const router = express.Router();


router.post('/', messageController.createMessage);


router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

router.get('/', messageController.getAllMessages);
router.patch('/:id/read', messageController.markAsRead);
router.delete('/:id', messageController.deleteMessage);

module.exports = router;
