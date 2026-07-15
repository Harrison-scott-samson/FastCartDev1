const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus, getAdminStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/orders').get(protect, admin, getAllOrders);
router.route('/orders/:id/status').put(protect, admin, updateOrderStatus);
router.route('/stats').get(protect, admin, getAdminStats);

module.exports = router;
