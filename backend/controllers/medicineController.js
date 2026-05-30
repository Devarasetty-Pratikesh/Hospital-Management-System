const pool = require('../config/db');

exports.addMedicine = async (req, res) => {
    const { medicine_name, price } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO Medicine (medicine_name, price) VALUES (?, ?)', [medicine_name, price]);
        res.status(201).json({ message: 'Medicine added successfully', medicine_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllMedicines = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Medicine');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.prescribeMedicine = async (req, res) => {
    const { patient_id, medicines } = req.body;
    try {
        if (!medicines || medicines.length === 0) return res.status(400).json({ message: 'No medicines selected' });

        // Ensure Patient exists in Out_Patient table
        const [pat] = await pool.query('SELECT patient_name, mobile FROM Patient WHERE patient_id = ?', [patient_id]);
        if (pat.length > 0) {
            await pool.query(
                'INSERT IGNORE INTO Out_Patient (patient_id, patient_name, mobile, doctor_name) VALUES (?, ?, ?, ?)',
                [patient_id, pat[0].patient_name, pat[0].mobile, 'Assigned']
            );
        }
        
        // Insert each medicine
        await Promise.all(medicines.map(med => 
            pool.query(
                'INSERT INTO Out_Patient_Medical (patient_id, medicine_id, quantity) VALUES (?, ?, ?)',
                [patient_id, med.medicine_id, med.quantity]
            )
        ));

        res.status(201).json({ message: 'Medicines prescribed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
