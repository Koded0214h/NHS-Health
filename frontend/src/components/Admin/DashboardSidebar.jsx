// components/DashboardSidebar.jsx
import React from 'react';

const DashboardSidebar = () => {
  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', active: true },
    { icon: 'receipt_long', label: 'All Requisitions' },
    { icon: 'domain', label: 'Departments' },
    { icon: 'group', label: 'Users' },
    { icon: 'fact_check', label: 'Audit Logs' },
  ];

  const bottomItems = [
    { icon: 'settings', label: 'Settings' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300">
      <div className="flex flex-col h-full">
        {/* Logo Area */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">local_hospital</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 text-xl font-bold leading-none tracking-tight">NHS Health</h1>
            <span className="text-xs text-slate-500 font-medium tracking-wide">Operations Admin</span>
          </div>
        </div>
        
        {/* User Brief */}
        <div className="px-4 py-6">
          <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full size-10 flex-shrink-0 border-2 border-white shadow-sm"
              style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBG40-RxHN1OX9C0taS8k5P13JaNmycAKZRRrvQ3H-3h2hZ5vcL6EsYJghqOyXDUqf-bAFLC-tQHmgLF8oVJ1VCYymFhgY3SeA42FlzApEE8l_LcRlvtAyVMWey7H8zpBKUJrx1_S-TB-tYlbQ3dCuAEqfIPruruMzB-cdCnymLJE3nYYZlWKPC4Ym6VG5kQ623zKh8bn0KYVB2N8YATN4oPvpA4JipKf28sxEcA5DGnrIWn3VPYmFMEcuPv-n3ZNo4onUa8oTJ20JU")' }}
            ></div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-sm font-semibold truncate text-slate-900">Sarah Jenkins</h2>
              <p className="text-xs text-slate-500 truncate">Head of Procurement</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className={`text-sm ${item.active ? 'font-semibold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </a>
            ))}
          </nav>
        </div>
        
        {/* Bottom Actions */}
        <div className="mt-auto p-4 border-t border-slate-100">
          {bottomItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors mb-2"
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;