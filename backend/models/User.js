const db = require('../db/database');

const User = {
    create(name, email, passwordHash, role) {
        const stmt = db.prepare(`
            INSERT INTO users (name, email, password_hash, role)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(name, email, passwordHash, role);
        return this.findById(result.lastInsertRowid);
    },

    findById(id) {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        return stmt.get(id);
    },

    findByEmail(email) {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email);
    },

    findAll() {
        const stmt = db.prepare('SELECT id, name, email, role, created_at FROM users');
        return stmt.all();
    },

    findByRole(role) {
        const stmt = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE role = ?');
        return stmt.all(role);
    },

    update(id, fields) {
        const allowed = ['name', 'email', 'password_hash', 'role'];
        const updates = [];
        const values = [];
        
        for (const [key, value] of Object.entries(fields)) {
            if (allowed.includes(key) && value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }
        
        if (updates.length === 0) return this.findById(id);
        
        values.push(id);
        const stmt = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
        stmt.run(...values);
        return this.findById(id);
    },

    delete(id) {
        const stmt = db.prepare('DELETE FROM users WHERE id = ?');
        return stmt.run(id);
    }
};

module.exports = User;
