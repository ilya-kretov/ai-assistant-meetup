const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('movies.db');

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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Close the database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
  } else {
    console.log('Database setup completed');
  }
});
