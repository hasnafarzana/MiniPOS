const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'expenses.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

function initializeDatabase() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
    console.log('Database initialized successfully');
}

initializeDatabase();

module.exports = db;
