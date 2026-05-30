const pool = require('./config/db');

async function createOutPatientBillTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Out_Patient_Bill (
                bill_id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                total DECIMAL(10, 2) NOT NULL,
                status VARCHAR(20) DEFAULT 'Unpaid',
                bill_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE
            )
        `);
        console.log('Successfully created Out_Patient_Bill table');
        process.exit(0);
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
}

createOutPatientBillTable();
