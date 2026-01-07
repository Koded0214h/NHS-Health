// components/AllRequisitions.jsx
import React, { useState } from 'react';
import RequisitionsHeader from './RequisitionsHeader';
import RequisitionsFilters from './RequisitionsFilters';
import KanbanBoard from './KanbanBoard';

const AllRequisitions = () => {
  const [activeView, setActiveView] = useState('board');
  const [filters, setFilters] = useState({
    search: '',
    department: 'All Departments',
    priority: 'High'
  });

  return (
    <div className="bg-background-light text-slate-900 h-screen overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Top Navigation */}
        <RequisitionsHeader />
        
        {/* Main Content */}
        <main className="flex flex-col flex-1 overflow-hidden relative">
          {/* Page Header & Controls (Sticky) */}
          <div className="flex flex-col gap-4 px-6 py-6 bg-background-light z-10 shrink-0">
            {/* Title Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-slate-900 text-3xl font-bold leading-tight tracking-tight">All Requisitions</h1>
                <p className="text-slate-600 text-sm mt-1">Manage, track, and approve hospital inventory requests across departments.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="hidden sm:flex items-center gap-2 h-10 px-4 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[20px]">ios_share</span>
                  Export
                </button>
                <button className="flex items-center gap-2 h-10 px-5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-bold shadow-md shadow-primary/20 transition-all">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  New Requisition
                </button>
              </div>
            </div>

            {/* Filters & View Toggle Row */}
            <RequisitionsFilters 
              activeView={activeView}
              onViewChange={setActiveView}
              filters={filters}
              onFilterChange={setFilters}
            />
          </div>

          {/* Content Area */}
          {activeView === 'board' && <KanbanBoard />}
          {/* Add Table and Timeline views here */}
        </main>
      </div>
    </div>
  );
};

export default AllRequisitions;