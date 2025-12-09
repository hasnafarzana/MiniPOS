-- SQLite Schema for Expense Management System

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('EMPLOYEE', 'MANAGER')),
    created_at TEXT DEFAULT (datetime('now'))
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    receipt_url TEXT,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Approvals table
CREATE TABLE IF NOT EXISTS approvals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    expense_id INTEGER NOT NULL,
    approver_id INTEGER NOT NULL,
    decision TEXT NOT NULL CHECK (decision IN ('APPROVED', 'REJECTED')),
    remark TEXT,
    decided_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_expenses_employee_id ON expenses(employee_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON expenses(status);
CREATE INDEX IF NOT EXISTS idx_approvals_expense_id ON approvals(expense_id);
CREATE INDEX IF NOT EXISTS idx_approvals_approver_id ON approvals(approver_id);
