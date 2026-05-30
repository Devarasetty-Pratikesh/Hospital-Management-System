const pool = require('./config/db');

async function test() {
    const [rows] = await pool.query('SELECT * FROM Staff LIMIT 1');
    console.log(rows);
    process.exit(0);
}
test();
