const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/', roomController.getAllRooms);
router.post('/', roomController.addRoom);
router.delete('/:room_id', roomController.deleteRoom);
router.post('/admit', roomController.admitPatient);
router.post('/discharge/:admission_id', roomController.dischargePatient);

module.exports = router;
