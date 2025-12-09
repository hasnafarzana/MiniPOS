const db = require('../db/database');

const Expense = {
    create(employeeId, title, amount, category, date, description = null, receiptUrl = null) {
        const stmt = db.prepare(`
            INSERT INTO expenses (employee_id, title, amount, category, date, description, receipt_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(employeeId, title, amount, category, date, description, receiptUrl);
        return this.findById(result.lastInsertRowid);
    },

    findById(id) {
        const stmt = db.prepare(`
            SELECT e.*, u.name as employee_name, u.email as employee_email
            FROM expenses e
            JOIN users u ON e.employee_id = u.id
            WHERE e.id = ?
        `);
        return stmt.get(id);
    },

    findByEmployeeId(employeeId) {
        const stmt = db.prepare(`
            SELECT * FROM expenses WHERE employee_id = ? ORDER BY created_at DESC
        `);
        return stmt.all(employeeId);
    },

    findByStatus(status) {
        const stmt = db.prepare(`
            SELECT e.*, u.name as employee_name, u.email as employee_email
            FROM expenses e
            JOIN users u ON e.employee_id = u.id
            WHERE e.status = ?
            ORDER BY e.created_at DESC
        `);
        return stmt.all(status);
    },

    findAll() {
        const stmt = db.prepare(`
            SELECT e.*, u.name as employee_name, u.email as employee_email
            FROM expenses e
            JOIN users u ON e.employee_id = u.id
            ORDER BY e.created_at DESC
        `);
        return stmt.all();
    },

    update(id, fields) {
        const allowed = ['title', 'amount', 'category', 'date', 'description', 'receipt_url', 'status'];
        const updates = ['updated_at = datetime("now")'];
        const values = [];
        
        for (const [key, value] of Object.entries(fields)) {
            if (allowed.includes(key) && value !== undefined) {
                updates.push(`${key} = ?`);
                values.push(value);
            }
        }
        
        values.push(id);
        const stmt = db.prepare(`UPDATE expenses SET ${updates.join(', ')} WHERE id = ?`);
        stmt.run(...values);
        return this.findById(id);
    },

    updateStatus(id, status) {
        return this.update(id, { status });
    },

    delete(id) {
        const stmt = db.prepare('DELETE FROM expenses WHERE id = ?');
        return stmt.run(id);
    },

    getPendingForApproval() {
        return this.findByStatus('PENDING');
    }
};

module.exports = Expense;
