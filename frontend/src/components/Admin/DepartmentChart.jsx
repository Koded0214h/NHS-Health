// components/DepartmentChart.jsx
import React from 'react';

const DepartmentChart = () => {
  const departments = [
    { name: 'ER', value: 85, height: '85%' },
    { name: 'ICU', value: 65, height: '65%' },
    { name: 'Peds', value: 45, height: '45%' },
    { name: 'Surg', value: 30, height: '30%' },
    { name: 'Lab', value: 55, height: '55%' },
  ];

  const getBarColor = (index) => {
    const colors = [
      'bg-primary',
      'bg-primary/80',
      'bg-primary/60',
      'bg-primary/40',
      'bg-primary/30'
    ];
    return colors[index] || colors[0];
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Department Usage</h3>
      
      {/* Pure CSS Chart */}
      <div className="flex items-end justify-between h-48 gap-2">
        {departments.map((dept, index) => (
          <div key={dept.name} className="flex flex-col items-center gap-2 group w-full">
            <div className="w-full bg-blue-100 rounded-t-lg relative h-full flex items-end overflow-hidden">
              <div 
                className={`w-full ${getBarColor(index)} hover:bg-blue-600 transition-all duration-500 rounded-t-lg`}
                style={{ height: dept.height }}
              ></div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                {dept.value} Reqs
              </div>
            </div>
            <span className="text-xs text-slate-500 font-medium">{dept.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentChart;