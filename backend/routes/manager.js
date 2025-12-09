const express = require('express');
const Expense = require('../models/Expense');
const Approval = require('../models/Approval');
const { authenticateToken, requireManager } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.use(requireManager);

router.get('/expenses/pending', (req, res) => {
    try {
        const expenses = Expense.getPendingForApproval();
        res.json({ expenses });
    } catch (error) {
        console.error('Get pending expenses error:', error);
        res.status(500).json({ error: 'Failed to fetch pending expenses' });
    }
});

router.get('/expenses', (req, res) => {
    try {
        const { status } = req.query;
        let expenses = Expense.findAll();

        if (status && ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
            expenses = expenses.filter(e => e.status === status);
        }

        res.json({ expenses });
    } catch (error) {
        console.error('Get all expenses error:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

router.post('/expenses/:id/decision', (req, res) => {
    try {
        const { id } = req.params;
        const { decision, remark } = req.body;

        if (!decision || !['APPROVED', 'REJECTED'].includes(decision)) {
            return res.status(400).json({ error: 'Decision must be APPROVED or REJECTED' });
        }

        const expense = Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        if (expense.status !== 'PENDING') {
            return res.status(400).json({ error: 'Only pending expenses can be reviewed' });
        }

        const approval = Approval.create(
            parseInt(id),
            req.user.id,
            decision,
            remark || null
        );

        Expense.updateStatus(id, decision);
        const updatedExpense = Expense.findById(id);

        res.json({
            message: `Expense ${decision.toLowerCase()} successfully`,
            expense: updatedExpense,
            approval
        });
    } catch (error) {
        console.error('Decision error:', error);
        res.status(500).json({ error: 'Failed to process decision' });
    }
});

router.get('/expenses/:id/history', (req, res) => {
    try {
        const { id } = req.params;
        const expense = Expense.findById(id);

        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        const approvals = Approval.findByExpenseId(id);

        res.json({ expense, approvals });
    } catch (error) {
        console.error('Get expense history error:', error);
        res.status(500).json({ error: 'Failed to fetch expense history' });
    }
});

module.exports = router;
