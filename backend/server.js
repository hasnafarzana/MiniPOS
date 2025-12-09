const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const managerRoutes = require('./routes/manager');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/docs', express.static(path.join(__dirname, '../docs')));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/manager', managerRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
