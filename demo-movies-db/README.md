# Demo of the Cline+Claude Sonnet3.5 capabilities

Prompt that was used for generation is:
```
Using sqlite and nodejs + express write backend for handling movies DB.
Db should contain entity "movie" with properties: 
- title
- year
- awards
- studio name
- producer 
- actors as a comma-separated string list
```

## How to Use

1. Clone the repository
2. Install dependencies:
    ```bash
    npm install
    ```
3. Initialize the database:
    ```bash
    npm run init-db
    ```
4. Start the server:
    ```bash
    npm start
    ```

### API Endpoints

- `GET /movies` - Get all movies
- `GET /movies/:id` - Get movie by ID
- `POST /movies` - Add new movie
- `PUT /movies/:id` - Update movie
- `DELETE /movies/:id` - Delete movie

### Example API Calls

```bash
# Add a new movie
curl -X POST http://localhost:3000/api/movies \
    -H "Content-Type: application/json" \
    -d '{
        "title": "The Matrix",
        "year": 1999,
        "awards": "4 Academy Awards",
        "studio_name": "Warner Bros.",
        "producer": "Joel Silver",
        "actors": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss"
    }'

# Get a movie by ID
curl http://localhost:3000/api/movies/1

# Delete a movie
curl -X DELETE http://localhost:3000/api/movies/1
```