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

After couple of attempts to make Sqlite MCP server operate as required this was rewritten.
Now it uses Postgres.

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
curl -s -X POST http://localhost:3000/api/movies \
    -H "Content-Type: application/json" \
    -d '{
        "title": "The Matrix",
        "year": 1999,
        "awards": "4 Academy Awards",
        "studio_name": "Warner Bros.",
        "producer": "Joel Silver",
        "actors": "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss"
    }' | jq '.'

# Get all movies
curl -s http://localhost:3000/api/movies | jq '.'

# Get specific fields with custom formatting
curl -s http://localhost:3000/api/movies | jq '.[] | {title, year}'

# Get a movie by ID
curl -s http://localhost:3000/api/movies/1 | jq '.'

# Delete a movie
curl -s -X DELETE http://localhost:3000/api/movies/1
```

One more movie for demo purposes:
```
curl -X POST http://localhost:3000/api/movies \
-H "Content-Type: application/json" \
-d '{
  "title": "Inception",
  "year": 2010,
  "awards": "4 Academy Awards",
  "studio_name": "Warner Bros.",
  "producer": "Christopher Nolan",
  "actors": ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"]
}'
```

# Postgresql init

PG docker container init:
```
docker run --name movies-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=moviesdb -p 5432:5432 -d postgres:16
```

PG schema init:
```
docker exec -i movies-postgres psql -U postgres -d moviesdb << EOF
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    awards TEXT,
    studio_name VARCHAR(255),
    producer VARCHAR(255),
    actors TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(title, year)
);
EOF
```
