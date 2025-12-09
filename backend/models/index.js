const User = require('./User');
const Expense = require('./Expense');
const Approval = require('./Approval');
const db = require('../db/database');

module.exports = {
    User,
    Expense,
    Approval,
    db
};
