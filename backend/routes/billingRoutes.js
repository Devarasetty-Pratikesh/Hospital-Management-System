const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');

router.post('/generate', billingController.generateBill);
router.get('/', billingController.getBillDetails);
router.put('/:bill_id/status', billingController.updateBillStatus);

router.post('/outpatient/generate', billingController.generateOutpatientBill);
router.get('/outpatient', billingController.getOutpatientBills);
router.put('/outpatient/:bill_id/status', billingController.updateOutpatientBillStatus);

module.exports = router;
