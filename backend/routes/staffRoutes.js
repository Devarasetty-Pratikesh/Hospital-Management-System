const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');

router.post('/', staffController.addStaff);
router.get('/', staffController.getAllStaff);
router.post('/cashier', staffController.assignCashier);

module.exports = router;
