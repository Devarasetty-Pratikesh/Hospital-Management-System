const pool = require('../config/db');

exports.addPatient = async (req, res) => {
    const { name, gender, dob, mobile, registered_by_staff } = req.body;
    try {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
        }
        const admission_date = new Date().toISOString().split('T')[0];
        
        const [result] = await pool.query(
            'INSERT INTO Patient (patient_name, gender, age, dob, mobile, admission_date, registered_by_staff) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, gender, age, dob, mobile, admission_date, registered_by_staff || 1]
        );
        // Also insert into Out_Patient by default, or we just keep them in Patient
        res.status(201).json({ message: 'Patient added successfully', patient_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPatients = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Patient');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPatientById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Patient WHERE patient_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Patient not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePatient = async (req, res) => {
    const { name, gender, dob, mobile } = req.body;
    try {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
        }

        await pool.query(
            'UPDATE Patient SET patient_name = ?, gender = ?, age = ?, dob = ?, mobile = ? WHERE patient_id = ?',
            [name, gender, age, dob, mobile, req.params.id]
        );
        res.json({ message: 'Patient updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePatient = async (req, res) => {
    try {
        const id = req.params.id;
        // 1. Delete In_Patient_Bill associated with this patient's admissions
        await pool.query('DELETE b FROM In_Patient_Bill b JOIN In_Patient ip ON b.admission_id = ip.admission_id WHERE ip.patient_id = ?', [id]);
        
        // 2. Delete In_Patient records
        await pool.query('DELETE FROM In_Patient WHERE patient_id = ?', [id]);

        // 3. Delete Out_Patient_Medical records
        await pool.query('DELETE FROM Out_Patient_Medical WHERE patient_id = ?', [id]);

        // 4. Delete Out_Patient records
        await pool.query('DELETE FROM Out_Patient WHERE patient_id = ?', [id]);
        
        // 5. Delete Patient Log if linked
        await pool.query('DELETE FROM patient_log WHERE patient_id = ?', [id]);

        // Finally delete the patient
        await pool.query('DELETE FROM Patient WHERE patient_id = ?', [id]);
        res.json({ message: 'Patient and all associated records deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
