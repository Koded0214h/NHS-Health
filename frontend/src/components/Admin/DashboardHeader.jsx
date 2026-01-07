// components/DashboardHeader.jsx
import React from 'react';

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shrink-0 z-10">
      <div className="flex items-center gap-6 w-1/3">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input 
            className="block w-full pl-10 pr-3 py-2 border-none rounded-lg bg-slate-100 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50" 
            placeholder="Search by requisition ID, department..." 
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <span className="material-symbols-outlined">help</span>
        </button>
        
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg transition-colors shadow-sm shadow-blue-500/30">
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;