const fs = require('fs');
const path = require('path');
const pool = require('./config/db');

async function initializeDatabase() {
    try {
        console.log('Reading database.sql file...');
        const sqlFilePath = path.join(__dirname, '..', 'database.sql');
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

        // Split by semicolon, filtering out empty statements
        const statements = sqlContent
            .split(';')
            .map(stmt => {
                // Remove SQL comments (lines starting with --)
                return stmt
                    .split('\n')
                    .filter(line => !line.trim().startsWith('--'))
                    .join('\n')
                    .trim();
            })
            .filter(stmt => stmt.length > 0);

        console.log(`Found ${statements.length} SQL statements to execute.`);

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            
            // Skip database creation if we are connected to a specific database (like on Railway)
            if (statement.toUpperCase().startsWith('CREATE DATABASE') || statement.toUpperCase().startsWith('USE ')) {
                console.log(`Skipping: ${statement.substring(0, 30)}...`);
                continue;
            }

            try {
                await pool.query(statement);
                console.log(`Executed (${i + 1}/${statements.length}): ${statement.substring(0, 50).replace(/\n/g, ' ')}...`);
            } catch (err) {
                // If tables already exist, we can ignore that specific warning
                if (err.code === 'ER_TABLE_EXISTS_ERROR') {
                    console.log(`Table already exists, skipping...`);
                } else {
                    console.warn(`Warning executing statement:`, err.message);
                }
            }
        }

        console.log('🎉 Database initialization complete!');
    } catch (error) {
        console.error('❌ Failed to initialize database:', error);
    } finally {
        process.exit(0);
    }
}

initializeDatabase();
