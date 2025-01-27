const express = require('express');
const db = require('./db/database');

const app = express();
const port = 3000;

app.use(express.json());

// Get all movies
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await db.all('SELECT * FROM movies ORDER BY created_at DESC');
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single movie by ID
app.get('/api/movies/:id', async (req, res) => {
    try {
        const movie = await db.get('SELECT * FROM movies WHERE id = ?', [req.params.id]);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new movie
app.post('/api/movies', async (req, res) => {
    const { title, year, awards, studio_name, producer, actors } = req.body;
    
    if (!title || !year) {
        return res.status(400).json({ error: 'Title and year are required' });
    }

    try {
        const result = await db.run(
            `INSERT INTO movies (title, year, awards, studio_name, producer, actors)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, year, awards, studio_name, producer, actors]
        );
        
        const newMovie = await db.get('SELECT * FROM movies WHERE id = ?', [result.id]);
        res.status(201).json(newMovie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a movie
app.put('/api/movies/:id', async (req, res) => {
    const { title, year, awards, studio_name, producer, actors } = req.body;
    
    if (!title || !year) {
        return res.status(400).json({ error: 'Title and year are required' });
    }

    try {
        const movie = await db.get('SELECT * FROM movies WHERE id = ?', [req.params.id]);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        await db.run(
            `UPDATE movies 
             SET title = ?, year = ?, awards = ?, studio_name = ?, producer = ?, actors = ?
             WHERE id = ?`,
            [title, year, awards, studio_name, producer, actors, req.params.id]
        );
        
        const updatedMovie = await db.get('SELECT * FROM movies WHERE id = ?', [req.params.id]);
        res.json(updatedMovie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a movie
app.delete('/api/movies/:id', async (req, res) => {
    try {
        const movie = await db.get('SELECT * FROM movies WHERE id = ?', [req.params.id]);
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        await db.run('DELETE FROM movies WHERE id = ?', [req.params.id]);
        res.json({ message: 'Movie deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
