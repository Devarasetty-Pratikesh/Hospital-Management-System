const pool = require('../config/db');

exports.addStaff = async (req, res) => {
    try {
        const { fname, lname, username, designation, mobile } = req.body;
        const [result] = await pool.query(
            'INSERT INTO Staff (first_name, last_name, username, designation, mobile) VALUES (?, ?, ?, ?, ?)',
            [fname || 'FN', lname || 'LN', username, designation, mobile]
        );
        res.status(201).json({ message: 'Staff added successfully', staff_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllStaff = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Staff');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignCashier = async (req, res) => {
    try {
        const { staff_id } = req.body;
        const [result] = await pool.query('INSERT INTO Cashier (staff_id) VALUES (?)', [staff_id]);
        res.status(201).json({ message: 'Cashier assigned successfully', cashier_id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
