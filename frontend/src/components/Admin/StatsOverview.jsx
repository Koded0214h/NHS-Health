// components/StatsOverview.jsx
import React from 'react';

const StatsOverview = () => {
  const stats = [
    {
      title: 'Total Requisitions',
      value: '1,245',
      icon: 'receipt_long',
      color: 'primary',
      trend: { direction: 'up', value: '+12%', label: 'from last month' }
    },
    {
      title: 'Pending Approvals',
      value: '45',
      icon: 'pending_actions',
      color: 'orange',
      trend: { direction: 'high', value: 'Needs attention' }
    },
    {
      title: 'Awaiting Delivery',
      value: '12',
      icon: 'local_shipping',
      color: 'blue',
      trend: { direction: 'neutral', value: 'On schedule' }
    },
    {
      title: 'Overdue Requests',
      value: '3',
      icon: 'warning',
      color: 'red',
      trend: { direction: 'up', value: '+2%', label: 'vs yesterday' },
      highlight: true
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'text-primary',
      orange: 'text-orange-500',
      blue: 'text-blue-500',
      red: 'text-red-500'
    };
    return colors[color] || colors.primary;
  };

  const getTrendIcon = (direction) => {
    const icons = {
      up: 'trending_up',
      high: 'priority_high',
      neutral: 'remove'
    };
    return icons[direction] || 'remove';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className={`bg-white p-6 rounded-xl border ${
            stat.highlight 
              ? 'border-red-200 bg-red-50/50' 
              : 'border-slate-200'
          } shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group`}
        >
          <div className={`absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${getColorClasses(stat.color)}`}>
            <span className="material-symbols-outlined text-6xl">{stat.icon}</span>
          </div>
          
          <div className="relative z-10">
            <p className={`text-sm font-medium ${
              stat.highlight ? 'text-red-800' : 'text-slate-500'
            }`}>
              {stat.title}
            </p>
            <h3 className={`text-3xl font-bold mt-1 ${
              stat.highlight ? 'text-red-900' : 'text-slate-900'
            }`}>
              {stat.value}
            </h3>
          </div>
          
          <div className={`flex items-center gap-1 text-sm font-medium relative z-10 ${
            stat.highlight ? 'text-red-700' : 
            stat.color === 'orange' ? 'text-orange-600' :
            stat.color === 'blue' ? 'text-slate-500' :
            'text-emerald-600'
          }`}>
            <span className="material-symbols-outlined text-sm">
              {getTrendIcon(stat.trend.direction)}
            </span>
            <span>
              {stat.trend.value} {stat.trend.label && <span>{stat.trend.label}</span>}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;