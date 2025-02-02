const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('movies.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create movies table
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
`, (err) => {
    if (err) {
        console.error('Error creating table:', err);
        return;
    }
    insertMovies();
});

function insertMovies() {
    // Insert test data
    movies.forEach(movie => {
        const sql = `
            INSERT INTO movies (title, year, awards, studio_name, producer, actors)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        db.run(sql, [
            movie.title,
            movie.year,
            movie.awards,
            movie.studio_name,
            movie.producer,
            movie.actors
        ], function(err) {
            if (err) {
                console.error('Error inserting movie:', err);
            } else {
                console.log(`Inserted movie ${movie.title} with ID: ${this.lastID}`);
            }
        });
    });

    // Close the database connection after inserting all movies
    setTimeout(() => {
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('Database connection closed');
            }
        });
    }, 1000);
}

const movies = [
    {
        title: 'The Shawshank Redemption',
        year: 1994,
        awards: 'Academy Award Nominations for Best Picture, Best Actor',
        studio_name: 'Castle Rock Entertainment',
        producer: 'Niki Marvin',
        actors: 'Tim Robbins, Morgan Freeman, Bob Gunton'
    },
    {
        title: 'The Godfather',
        year: 1972,
        awards: 'Academy Award for Best Picture, Best Actor, Best Adapted Screenplay',
        studio_name: 'Paramount Pictures',
        producer: 'Albert S. Ruddy',
        actors: 'Marlon Brando, Al Pacino, James Caan'
    }
];
