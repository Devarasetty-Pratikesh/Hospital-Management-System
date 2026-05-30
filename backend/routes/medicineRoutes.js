const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

router.post('/', medicineController.addMedicine);
router.get('/', medicineController.getAllMedicines);
router.post('/prescribe', medicineController.prescribeMedicine);

module.exports = router;
