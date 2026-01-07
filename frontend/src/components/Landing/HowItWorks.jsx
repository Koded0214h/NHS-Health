// components/HowItWorks.jsx
import React from 'react';

const HowItWorks = () => {
  const steps = [
    { number: 1, icon: 'person_add', title: 'Dept Requests', description: 'Officer submits detailed digital request form.' },
    { number: 2, icon: 'approval', title: 'HOD Approves', description: 'One-click approval from HOD or Admin.' },
    { number: 3, icon: 'inventory', title: 'Inventory Check', description: 'System auto-checks stock levels in warehouse.' },
    { number: 4, icon: 'local_shipping', title: 'Vendor Fulfills', description: 'Vendor confirms order and initiates delivery.' },
    { number: 5, icon: 'verified', title: 'Delivery Verified', description: 'Digital signature & timestamp upon receipt.' },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">The NHS Health Workflow</h2>
          <p className="text-slate-600">From initial request to final delivery verification.</p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-slate-200 z-0"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => (
              <Step key={index} step={step} />
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-center gap-6 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <span className="material-symbols-outlined text-primary text-base">history</span>
            Full audit trail maintained at every step
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <span className="material-symbols-outlined text-primary text-base">notifications_active</span>
            Email notifications keep everyone informed
          </div>
        </div>
      </div>
    </section>
  );
};

const Step = ({ step }) => {
  return (
    <div className="flex flex-row lg:flex-col items-start lg:items-center gap-6 lg:gap-4 group">
      <div className="w-24 h-24 lg:w-24 lg:h-24 shrink-0 bg-white border-2 border-slate-200 group-hover:border-primary transition-colors rounded-full flex items-center justify-center shadow-sm relative">
        <span className="absolute -top-3 -right-3 w-8 h-8 bg-slate-200 text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors rounded-full flex items-center justify-center font-bold text-sm">
          {step.number}
        </span>
        <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-primary transition-colors">
          {step.icon}
        </span>
      </div>
      <div className="text-left lg:text-center pt-2">
        <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
        <p className="text-sm text-slate-600 mt-1">{step.description}</p>
      </div>
    </div>
  );
};

export default HowItWorks;