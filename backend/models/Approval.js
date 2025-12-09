const db = require('../db/database');

const Approval = {
    create(expenseId, approverId, decision, remark = null) {
        const stmt = db.prepare(`
            INSERT INTO approvals (expense_id, approver_id, decision, remark)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(expenseId, approverId, decision, remark);
        return this.findById(result.lastInsertRowid);
    },

    findById(id) {
        const stmt = db.prepare(`
            SELECT a.*, u.name as approver_name, u.email as approver_email
            FROM approvals a
            JOIN users u ON a.approver_id = u.id
            WHERE a.id = ?
        `);
        return stmt.get(id);
    },

    findByExpenseId(expenseId) {
        const stmt = db.prepare(`
            SELECT a.*, u.name as approver_name, u.email as approver_email
            FROM approvals a
            JOIN users u ON a.approver_id = u.id
            WHERE a.expense_id = ?
            ORDER BY a.decided_at DESC
        `);
        return stmt.all(expenseId);
    },

    findByApproverId(approverId) {
        const stmt = db.prepare(`
            SELECT a.*, e.title as expense_title, e.amount as expense_amount,
                   emp.name as employee_name
            FROM approvals a
            JOIN expenses e ON a.expense_id = e.id
            JOIN users emp ON e.employee_id = emp.id
            WHERE a.approver_id = ?
            ORDER BY a.decided_at DESC
        `);
        return stmt.all(approverId);
    },

    getLatestForExpense(expenseId) {
        const stmt = db.prepare(`
            SELECT a.*, u.name as approver_name
            FROM approvals a
            JOIN users u ON a.approver_id = u.id
            WHERE a.expense_id = ?
            ORDER BY a.decided_at DESC
            LIMIT 1
        `);
        return stmt.get(expenseId);
    },

    delete(id) {
        const stmt = db.prepare('DELETE FROM approvals WHERE id = ?');
        return stmt.run(id);
    }
};

module.exports = Approval;
