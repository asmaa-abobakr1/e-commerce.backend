const express = require('express');
const settingsController = require('../controllers/settings.controller');
const authMiddleware = require('../middelwares/auth.middelware');
const upload = require('../middelwares/upload.middelware');

const router = express.Router();

router.get('/', settingsController.getSettings);


router.patch('/', 
  authMiddleware.protect, 
  authMiddleware.restrictTo('admin'), 
  upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'marketingImages', maxCount: 10 }
  ]), 
  settingsController.updateSettings
);

module.exports = router;
