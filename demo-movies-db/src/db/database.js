const { Pool } = require('pg');

class Database {
    constructor() {
        this.pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'moviesdb',
            password: 'postgres',
            port: 5432,
        });
    }

    async all(query, params = []) {
        const { rows } = await this.pool.query(query, params);
        return rows;
    }

    async get(query, params = []) {
        const { rows } = await this.pool.query(query, params);
        return rows[0];
    }

    async run(query, params = []) {
        const result = await this.pool.query(query, params);
        return {
            id: result.rows[0]?.id,
            changes: result.rowCount
        };
    }
}

module.exports = new Database();
