const pool = require('./config/db');

async function clearBilling() {
    try {
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        await pool.query('TRUNCATE TABLE In_Patient_Bill');
        await pool.query('TRUNCATE TABLE Out_Patient_Bill');
        await pool.query('TRUNCATE TABLE Appointment');
        await pool.query('TRUNCATE TABLE Out_Patient_Medical');
        await pool.query('TRUNCATE TABLE In_Patient'); // Clear admissions to free rooms
        await pool.query('TRUNCATE TABLE Out_Patient');
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Cleared billing and admission history.');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
clearBilling();
