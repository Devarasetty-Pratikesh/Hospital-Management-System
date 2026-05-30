const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.post('/', doctorController.addDoctor);
router.get('/', doctorController.getAllDoctors);
router.put('/:doctor_id', doctorController.updateDoctor);
router.delete('/:doctor_id', doctorController.deleteDoctor);
router.post('/assign', doctorController.assignDoctorToPatient);

module.exports = router;
