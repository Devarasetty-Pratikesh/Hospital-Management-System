const pool = require('../config/db');

exports.generateBill = async (req, res) => {
    const { admission_id, status } = req.body;
    try {
        const [admission] = await pool.query(`
            SELECT ip.*, r.room_cost 
            FROM In_Patient ip
            JOIN Room r ON ip.room_id = r.room_id
            WHERE ip.admission_id = ?
        `, [admission_id]);

        if (admission.length === 0) return res.status(404).json({ message: 'Admission not found or room already freed' });

        const { room_cost, admission_date, patient_id } = admission[0];
        const days = Math.max(1, Math.ceil((new Date() - new Date(admission_date)) / (1000 * 60 * 60 * 24)));
        let total = days * room_cost;

        const [medicines] = await pool.query(`
            SELECT SUM(m.price * opm.quantity) as med_cost 
            FROM Out_Patient_Medical opm 
            JOIN Medicine m ON opm.medicine_id = m.medicine_id 
            WHERE opm.patient_id = ?
        `, [patient_id]);

        if (medicines.length > 0 && medicines[0].med_cost) {
            total += parseFloat(medicines[0].med_cost);
        }

        const [appts] = await pool.query('SELECT SUM(fee) as appt_cost FROM Appointment WHERE patient_id = ? AND is_billed = FALSE', [patient_id]);
        if (appts.length > 0 && appts[0].appt_cost) {
            total += parseFloat(appts[0].appt_cost);
        }

        const [existing] = await pool.query('SELECT * FROM In_Patient_Bill WHERE admission_id = ?', [admission_id]);
        if (existing.length > 0) return res.status(400).json({ message: 'A bill has already been generated for this admission.' });

        const billStatus = status === 'Paid' ? 'Paid' : 'Unpaid';
        const [result] = await pool.query('INSERT INTO In_Patient_Bill (admission_id, total, status) VALUES (?, ?, ?)', [admission_id, total, billStatus]);
        
        await pool.query('UPDATE Appointment SET is_billed = TRUE, ip_bill_id = ? WHERE patient_id = ? AND is_billed = FALSE', [result.insertId, patient_id]);

        res.status(201).json({ message: 'Bill generated successfully', bill_id: result.insertId, total, days, status: billStatus });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBillStatus = async (req, res) => {
    const { bill_id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE In_Patient_Bill SET status = ? WHERE bill_id = ?', [status || 'Paid', bill_id]);
        res.json({ message: 'Bill status updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBillDetails = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT b.*, p.patient_name, ip.admission_date 
            FROM In_Patient_Bill b
            JOIN In_Patient ip ON b.admission_id = ip.admission_id
            JOIN Patient p ON ip.patient_id = p.patient_id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.generateOutpatientBill = async (req, res) => {
    const { patient_id, status } = req.body;
    try {
        const [existing] = await pool.query('SELECT * FROM Out_Patient_Bill WHERE patient_id = ?', [patient_id]);
        if (existing.length > 0) return res.status(400).json({ message: 'A bill has already been generated for this patient.' });

        const [medicines] = await pool.query(`
            SELECT SUM(m.price * opm.quantity) as med_cost 
            FROM Out_Patient_Medical opm 
            JOIN Medicine m ON opm.medicine_id = m.medicine_id 
            WHERE opm.patient_id = ?
        `, [patient_id]);

        let total = medicines[0].med_cost || 0;

        const [appts] = await pool.query('SELECT SUM(fee) as appt_cost FROM Appointment WHERE patient_id = ? AND is_billed = FALSE', [patient_id]);
        if (appts.length > 0 && appts[0].appt_cost) {
            total += parseFloat(appts[0].appt_cost);
        }

        if (total <= 0) return res.status(400).json({ message: 'No unbilled charges found for this patient.' });

        const billStatus = status === 'Paid' ? 'Paid' : 'Unpaid';
        const [result] = await pool.query('INSERT INTO Out_Patient_Bill (patient_id, total, status) VALUES (?, ?, ?)', [patient_id, total, billStatus]);
        
        await pool.query('UPDATE Appointment SET is_billed = TRUE, op_bill_id = ? WHERE patient_id = ? AND is_billed = FALSE', [result.insertId, patient_id]);

        res.status(201).json({ message: 'Outpatient bill generated successfully', bill_id: result.insertId, total, status: billStatus });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOutpatientBillStatus = async (req, res) => {
    const { bill_id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE Out_Patient_Bill SET status = ? WHERE bill_id = ?', [status || 'Paid', bill_id]);
        res.json({ message: 'Outpatient bill status updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOutpatientBills = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT b.*, p.patient_name 
            FROM Out_Patient_Bill b
            JOIN Patient p ON b.patient_id = p.patient_id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
