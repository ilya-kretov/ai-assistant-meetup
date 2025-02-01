const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a new database or connect to existing one
const dbPath = path.resolve(__dirname, 'movies.db');
const db = new sqlite3.Database(dbPath);

// Create movies table
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            year INTEGER NOT NULL,
            awards TEXT,
            studio_name TEXT,
            producer TEXT,
            actors TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(title, year)
        )
    `);
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err);
    } else {
        console.log('Database initialized successfully');
    }
});
