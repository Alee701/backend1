const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getNotifications, markNotificationAsRead } = require('../controllers/notificationController');

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/:notificationId', protect, markNotificationAsRead);

module.exports = router;
