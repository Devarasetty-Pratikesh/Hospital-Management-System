const pool = require('../config/db');

exports.addDoctor = async (req, res) => {
    const { name, specialization, mobile, consultation_fee, appointed_by_admin, registered_by_staff } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO Doctor (doctor_name, specialization, mobile, consultation_fee, appointed_by_admin, registered_by_staff) VALUES (?, ?, ?, ?, ?, ?)',
            [name, specialization, mobile, consultation_fee || 500.00, appointed_by_admin || 1, registered_by_staff || 1]
        );
        res.status(201).json({ message: 'Doctor added successfully', doctor_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllDoctors = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Doctor');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignDoctorToPatient = async (req, res) => {
    res.json({ message: 'Logically assigned via frontend' });
};

exports.updateDoctor = async (req, res) => {
    const { doctor_id } = req.params;
    const { name, specialization, mobile, consultation_fee } = req.body;
    try {
        await pool.query('UPDATE Doctor SET doctor_name = ?, specialization = ?, mobile = ?, consultation_fee = ? WHERE doctor_id = ?', 
            [name, specialization, mobile, consultation_fee || 500.00, doctor_id]);
        res.json({ message: 'Doctor updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteDoctor = async (req, res) => {
    const { doctor_id } = req.params;
    try {
        await pool.query('DELETE FROM Doctor WHERE doctor_id = ?', [doctor_id]);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
