const pool = require('../config/db');

exports.bookAppointment = async (req, res) => {
    const { patient_id, doctor_id } = req.body;
    try {
        const [patient] = await pool.query('SELECT * FROM Patient WHERE patient_id = ?', [patient_id]);
        if (patient.length === 0) return res.status(404).json({ message: 'Patient not found' });

        const [doctor] = await pool.query('SELECT consultation_fee FROM Doctor WHERE doctor_id = ?', [doctor_id]);
        if (doctor.length === 0) return res.status(404).json({ message: 'Doctor not found' });

        const fee = doctor[0].consultation_fee;

        const [result] = await pool.query(
            'INSERT INTO Appointment (patient_id, doctor_id, fee) VALUES (?, ?, ?)',
            [patient_id, doctor_id, fee]
        );

        res.status(201).json({ message: 'Appointment booked successfully', appointment_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT a.*, p.patient_name, d.doctor_name, d.specialization
            FROM Appointment a
            JOIN Patient p ON a.patient_id = p.patient_id
            JOIN Doctor d ON a.doctor_id = d.doctor_id
            ORDER BY a.appointment_date DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
