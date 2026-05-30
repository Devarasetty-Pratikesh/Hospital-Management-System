const pool = require('../config/db');

exports.getAllRooms = async (req, res) => {
    try {
        // Get all rooms and check if they are currently occupied
        const [rows] = await pool.query(`
            SELECT r.*, ip.patient_id, ip.admission_id, p.patient_name 
            FROM Room r 
            LEFT JOIN In_Patient ip ON r.room_id = ip.room_id AND ip.discharge_date IS NULL
            LEFT JOIN Patient p ON ip.patient_id = p.patient_id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.admitPatient = async (req, res) => {
    const { patient_id, room_id } = req.body;
    try {
        // Check if room is available
        const [occupancy] = await pool.query('SELECT * FROM In_Patient WHERE room_id = ? AND discharge_date IS NULL', [room_id]);
        if (occupancy.length > 0) {
            return res.status(400).json({ message: 'Room is already occupied' });
        }

        const admission_date = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        const [result] = await pool.query(
            'INSERT INTO In_Patient (patient_id, room_id, admission_date) VALUES (?, ?, ?)',
            [patient_id, room_id, admission_date]
        );
        res.status(201).json({ message: 'Patient admitted successfully', admission_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.dischargePatient = async (req, res) => {
    const { admission_id } = req.params;
    try {
        // Set discharge_date to free the room but keep the record for billing history
        const discharge_date = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        await pool.query('UPDATE In_Patient SET discharge_date = ? WHERE admission_id = ?', [discharge_date, admission_id]);
        res.json({ message: 'Patient discharged successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addRoom = async (req, res) => {
    const { room_no, room_cost } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO Room (room_no, room_cost) VALUES (?, ?)', [room_no, room_cost]);
        res.status(201).json({ message: 'Room added successfully', room_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRoom = async (req, res) => {
    const { room_id } = req.params;
    try {
        await pool.query('DELETE FROM Room WHERE room_id = ?', [room_id]);
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
