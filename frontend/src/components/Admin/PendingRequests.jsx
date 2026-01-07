// components/PendingRequests.jsx
import React from 'react';

const PendingRequests = () => {
  const departments = [
    { code: 'ER', name: 'Emergency', count: 12, color: 'bg-red-100 text-red-600' },
    { code: 'PE', name: 'Pediatrics', count: 8, color: 'bg-orange-100 text-orange-600' },
    { code: 'IC', name: 'Intensive Care', count: 5, color: 'bg-blue-100 text-blue-600' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900">Pending Requests</h3>
        <button className="text-xs text-primary font-medium hover:underline">View All</button>
      </div>
      
      <div className="flex flex-col gap-4">
        {departments.map((dept) => (
          <div 
            key={dept.code} 
            className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
          >
            <div className="flex items-center gap-3">
              <div className={`size-8 rounded-lg flex items-center justify-center font-bold text-xs ${dept.color}`}>
                {dept.code}
              </div>
              <span className="text-sm font-medium text-slate-700">{dept.name}</span>
            </div>
            <span className="text-sm font-bold text-slate-900">{dept.count}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="material-symbols-outlined text-sm">info</span>
          <span>Approval bottleneck detected in ER dept.</span>
        </div>
      </div>
    </div>
  );
};

export default PendingRequests;