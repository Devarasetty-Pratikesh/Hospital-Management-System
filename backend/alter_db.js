const pool = require('./config/db');

async function alterTable() {
    try {
        await pool.query("ALTER TABLE In_Patient_Bill ADD COLUMN status VARCHAR(20) DEFAULT 'Unpaid'");
        console.log('Successfully altered In_Patient_Bill table');
    } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists.');
        } else {
            console.error('Error:', e);
        }
    } finally {
        process.exit(0);
    }
}
alterTable();
