const pool = require('./config/db');

async function modifyDatabaseForAppointments() {
    try {
        await pool.query(`
            ALTER TABLE Doctor 
            ADD COLUMN consultation_fee DECIMAL(10, 2) NOT NULL DEFAULT 500.00
        `);
        console.log('Added consultation_fee to Doctor table');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') console.log('consultation_fee already exists');
        else throw e;
    }

    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS Appointment (
                appointment_id INT AUTO_INCREMENT PRIMARY KEY,
                patient_id INT NOT NULL,
                doctor_id INT NOT NULL,
                fee DECIMAL(10,2) NOT NULL,
                is_billed BOOLEAN DEFAULT FALSE,
                ip_bill_id INT NULL,
                op_bill_id INT NULL,
                appointment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES Patient(patient_id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES Doctor(doctor_id) ON DELETE CASCADE,
                FOREIGN KEY (ip_bill_id) REFERENCES In_Patient_Bill(bill_id) ON DELETE SET NULL,
                FOREIGN KEY (op_bill_id) REFERENCES Out_Patient_Bill(bill_id) ON DELETE SET NULL
            )
        `);
        console.log('Created Appointment table');
    } catch (e) {
        throw e;
    }

    process.exit(0);
}

modifyDatabaseForAppointments();
