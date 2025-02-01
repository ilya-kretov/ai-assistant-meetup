const db = require('./database');

async function initializeDatabase() {
    try {
        await db.run(`
            CREATE TABLE IF NOT EXISTS movies (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                year INTEGER NOT NULL,
                awards TEXT,
                studio_name VARCHAR(255),
                producer VARCHAR(255),
                actors TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(title, year)
            )
        `);
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        // Close the pool
        await db.pool.end();
    }
}

initializeDatabase();
