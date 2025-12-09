const express = require('express');
const Expense = require('../models/Expense');
const { authenticateToken, requireEmployee } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.use(requireEmployee);

router.post('/', (req, res) => {
    try {
        const { title, amount, category, date, description, receipt_url } = req.body;

        if (!title || !amount || !category || !date) {
            return res.status(400).json({ error: 'Title, amount, category, and date are required' });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'Amount must be a positive number' });
        }

        const expense = Expense.create(
            req.user.id,
            title,
            amount,
            category,
            date,
            description || null,
            receipt_url || null
        );

        Expense.updateStatus(expense.id, 'PENDING');
        const updatedExpense = Expense.findById(expense.id);

        res.status(201).json({
            message: 'Expense submitted successfully',
            expense: updatedExpense
        });
    } catch (error) {
        console.error('Create expense error:', error);
        res.status(500).json({ error: 'Failed to create expense' });
    }
});

router.get('/my', (req, res) => {
    try {
        const { status } = req.query;
        let expenses = Expense.findByEmployeeId(req.user.id);

        if (status && ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
            expenses = expenses.filter(e => e.status === status);
        }

        res.json({ expenses });
    } catch (error) {
        console.error('Get my expenses error:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

router.get('/:id', (req, res) => {
    try {
        const expense = Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        if (expense.employee_id !== req.user.id && req.user.role !== 'MANAGER') {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ expense });
    } catch (error) {
        console.error('Get expense error:', error);
        res.status(500).json({ error: 'Failed to fetch expense' });
    }
});

module.exports = router;
