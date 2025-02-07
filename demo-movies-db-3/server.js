const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3001;

// Middleware for parsing JSON bodies
app.use(express.json());

// Database connection
const db = new sqlite3.Database('movies.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// GET all movies
app.get('/api/movies', (req, res) => {
  db.all('SELECT * FROM movies ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET single movie by ID
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

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Handle process termination
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
