const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());

// Create database connection
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
`);

// GET all movies
app.get('/api/movies', (req, res) => {
    db.all('SELECT * FROM movies', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// GET movie by ID
app.get('/api/movies/:id', (req, res) => {
    db.get('SELECT * FROM movies WHERE id = ?', [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }
        res.json(row);
    });
});

// POST new movie
app.post('/api/movies', (req, res) => {
    const { title, year, awards, studio_name, producer, actors } = req.body;
    
    if (!title || !year) {
        res.status(400).json({ error: 'Title and year are required' });
        return;
    }

    const sql = `
        INSERT INTO movies (title, year, awards, studio_name, producer, actors)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [title, year, awards, studio_name, producer, actors], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            id: this.lastID,
            title,
            year,
            awards,
            studio_name,
            producer,
            actors
        });
    });
});

// PUT update movie
app.put('/api/movies/:id', (req, res) => {
    const { title, year, awards, studio_name, producer, actors } = req.body;
    
    if (!title || !year) {
        res.status(400).json({ error: 'Title and year are required' });
        return;
    }

    const sql = `
        UPDATE movies 
        SET title = ?,
            year = ?,
            awards = ?,
            studio_name = ?,
            producer = ?,
            actors = ?
        WHERE id = ?
    `;

    db.run(sql, [title, year, awards, studio_name, producer, actors, req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }
        res.json({
            id: req.params.id,
            title,
            year,
            awards,
            studio_name,
            producer,
            actors
        });
    });
});

// DELETE movie
app.delete('/api/movies/:id', (req, res) => {
    db.run('DELETE FROM movies WHERE id = ?', [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }
        res.json({ message: 'Movie deleted successfully' });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
