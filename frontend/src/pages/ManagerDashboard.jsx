import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';

function ManagerDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('pending');
  const [pendingExpenses, setPendingExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [remark, setRemark] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);

  const navItems = [
    { id: 'pending', label: 'Pending Approvals', icon: '⏳', onClick: () => setActiveNav('pending') },
    { id: 'history', label: 'History', icon: '📜', onClick: () => setActiveNav('history') },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, allRes] = await Promise.all([
        fetch('/api/manager/expenses/pending', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/manager/expenses', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const pendingData = await pendingRes.json();
      const allData = await allRes.json();
      setPendingExpenses(pendingData.expenses || []);
      setAllExpenses(allData.expenses || []);
    } catch (err) {
      console.error('Failed to fetch expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (expenseId, decision) => {
    setActionLoading(expenseId);
    try {
      const res = await fetch(`/api/manager/expenses/${expenseId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ decision, remark })
      });
      if (res.ok) {
        setRemark('');
        setSelectedExpense(null);
        fetchData();
      }
    } catch (err) {
      console.error('Decision failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = {
    pending: pendingExpenses.length,
    approved: allExpenses.filter(e => e.status === 'APPROVED').length,
    rejected: allExpenses.filter(e => e.status === 'REJECTED').length,
    totalAmount: allExpenses.filter(e => e.status === 'APPROVED').reduce((sum, e) => sum + e.amount, 0),
  };

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      activeNavId={activeNav}
      pageTitle="Manager Dashboard"
      onLogout={handleLogout}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Pending Review" value={stats.pending} icon="⏳" color="amber" />
        <StatCard title="Approved" value={stats.approved} icon="✅" color="emerald" />
        <StatCard title="Rejected" value={stats.rejected} icon="❌" color="red" />
        <StatCard title="Approved Total" value={`$${stats.totalAmount.toFixed(2)}`} icon="💰" color="purple" />
      </div>

      {activeNav === 'pending' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Pending Approvals</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : pendingExpenses.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No pending expenses to review.</div>
          ) : (
            <div className="divide-y divide-slate-200">
              {pendingExpenses.map((expense) => (
                <div key={expense.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-800">{expense.title}</h4>
                        <StatusBadge status={expense.status} />
                      </div>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium">${expense.amount.toFixed(2)}</span>
                        {' • '}{expense.category}{' • '}{expense.date}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Submitted by: {expense.employee_name}
                      </p>
                      {expense.description && (
                        <p className="text-sm text-slate-500 mt-1 italic">"{expense.description}"</p>
                      )}
                    </div>

                    {selectedExpense === expense.id ? (
                      <div className="w-full sm:w-auto space-y-2">
                        <textarea
                          placeholder="Add a remark (optional)..."
                          value={remark}
                          onChange={(e) => setRemark(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDecision(expense.id, 'APPROVED')}
                            disabled={actionLoading === expense.id}
                            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleDecision(expense.id, 'REJECTED')}
                            disabled={actionLoading === expense.id}
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => { setSelectedExpense(null); setRemark(''); }}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedExpense(expense.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">Expense History</h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading...</div>
          ) : allExpenses.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No expenses found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {allExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-600">{expense.employee_name}</td>
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

export default ManagerDashboard;
