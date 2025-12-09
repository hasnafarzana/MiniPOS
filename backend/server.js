const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { authenticateToken, requireManager, requireEmployee } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/auth', authRoutes);

app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.get('/api/manager-only', authenticateToken, requireManager, (req, res) => {
  res.json({ message: 'This route is for managers only', user: req.user });
});

app.get('/api/employee', authenticateToken, requireEmployee, (req, res) => {
  res.json({ message: 'This route is for employees and managers', user: req.user });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
