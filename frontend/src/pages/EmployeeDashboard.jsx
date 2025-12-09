import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';

function EmployeeDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('expenses');
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', amount: '', category: 'Supplies', date: '', description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const navItems = [
    { id: 'expenses', label: 'My Expenses', icon: '📋', onClick: () => { setActiveNav('expenses'); setShowForm(false); } },
    { id: 'create', label: 'Create Expense', icon: '➕', onClick: () => { setActiveNav('create'); setShowForm(true); } },
  ];

  useEffect(() => {
    fetchExpenses();
  }, [filterStatus]);

  const fetchExpenses = async () => {
    try {
      const url = filterStatus ? `/api/expenses/my?status=${filterStatus}` : '/api/expenses/my';
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setExpenses(data.expenses || []);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, amount: parseFloat(formData.amount) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFormData({ title: '', amount: '', category: 'Supplies', date: '', description: '' });
      setShowForm(false);
      setActiveNav('expenses');
      fetchExpenses();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = {
    total: expenses.length,
    pending: expenses.filter(e => e.status === 'PENDING').length,
    approved: expenses.filter(e => e.status === 'APPROVED').length,
    rejected: expenses.filter(e => e.status === 'REJECTED').length,
  };

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      activeNavId={activeNav}
      pageTitle="Employee Dashboard"
      onLogout={handleLogout}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Expenses" value={stats.total} icon="📊" color="blue" />
        <StatCard title="Pending" value={stats.pending} icon="⏳" color="amber" />
        <StatCard title="Approved" value={stats.approved} icon="✅" color="emerald" />
        <StatCard title="Rejected" value={stats.rejected} icon="❌" color="red" />
      </div>

      {showForm ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Create New Expense</h3>
          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option>Supplies</option>
                  <option>Travel</option>
                  <option>Equipment</option>
                  <option>Software</option>
                  <option>Training</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description (optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Expense'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setActiveNav('expenses'); }}
                className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-800">My Expenses</h3>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : expenses.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No expenses found. Create your first expense!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{expense.title}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">${expense.amount.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{expense.category}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{expense.date}</td>
                      <td className="px-4 py-3"><StatusBadge status={expense.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

export default EmployeeDashboard;
