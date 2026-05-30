const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const [rows] = await pool.query('SELECT * FROM Admin WHERE username = ?', [username]);

        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ user_id: admin.user_id, role: 'admin' }, process.env.JWT_SECRET || 'supersecret_hms_key', { expiresIn: '1d' });
        res.json({ token, username: admin.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const [[{ total_patients }]] = await pool.query('SELECT COUNT(*) as total_patients FROM Patient');
        const [[{ total_doctors }]] = await pool.query('SELECT COUNT(*) as total_doctors FROM Doctor');
        const [[{ total_rooms }]] = await pool.query('SELECT COUNT(*) as total_rooms FROM Room');
        const [[{ ip_revenue }]] = await pool.query("SELECT SUM(total) as ip_revenue FROM In_Patient_Bill WHERE status = 'Paid'");
        const [[{ op_revenue }]] = await pool.query("SELECT SUM(total) as op_revenue FROM Out_Patient_Bill WHERE status = 'Paid'");
        
        const revenue = (parseFloat(ip_revenue) || 0) + (parseFloat(op_revenue) || 0);

        const [[{ total_consultation }]] = await pool.query(`
            SELECT SUM(fee) as total_consultation FROM Appointment 
            WHERE (ip_bill_id IN (SELECT bill_id FROM In_Patient_Bill WHERE status = 'Paid') 
               OR op_bill_id IN (SELECT bill_id FROM Out_Patient_Bill WHERE status = 'Paid'))
        `);

        // To reliably get pharmacy revenue without complex joins across two separate flows, 
        // we take total revenue - total consultation - room allocations.
        // Wait, room allocations:
        const [[{ total_room }]] = await pool.query(`
            SELECT SUM(r.room_cost * GREATEST(1, DATEDIFF(CURRENT_DATE(), ip.admission_date))) as total_room
            FROM In_Patient ip
            JOIN Room r ON ip.room_id = r.room_id
            JOIN In_Patient_Bill b ON ip.admission_id = b.admission_id
            WHERE b.status = 'Paid'
        `);

        const consultation = parseFloat(total_consultation) || 0;
        const rooms = parseFloat(total_room) || 0;
        const pharmacy = Math.max(0, revenue - consultation - rooms);
        
        res.json({
            patients: total_patients,
            doctors: total_doctors,
            rooms: total_rooms,
            revenue: revenue,
            revenue_split: {
                inpatient: rooms,
                outpatient: pharmacy,
                consultation: consultation
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
