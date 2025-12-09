import React from 'react';

function StatusBadge({ status }) {
  const styles = {
    DRAFT: 'bg-slate-100 text-slate-700',
    PENDING: 'bg-amber-100 text-amber-700',
    APPROVED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.DRAFT}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
