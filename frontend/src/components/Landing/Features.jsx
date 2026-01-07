// components/Features.jsx
import React from 'react';

const Features = () => {
  const features = [
    {
      icon: 'assignment',
      color: 'blue',
      title: 'Streamlined Requisitions',
      description: 'Paperless requisitions with intelligent digital forms and automated multi-level approval workflows.',
    },
    {
      icon: 'analytics',
      color: 'purple',
      title: 'Real-time Visibility',
      description: 'Live tracking dashboard with kanban board visualization and inventory analytics.',
    },
    {
      icon: 'hub',
      color: 'emerald',
      title: 'Vendor Integration',
      description: 'Seamless vendor coordination through dedicated portals for instant fulfillment and updates.',
    },
  ];

  return (
    <section className="py-20 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Streamlined Operations for Modern Hospitals
          </h2>
          <p className="text-lg text-slate-600">
            From initial request to final fulfillment, manage everything in one secure, unified platform designed for healthcare workflows.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-primary',
    purple: 'bg-purple-100 text-purple-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  };

  return (
    <div className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      <div className={`w-14 h-14 ${colorClasses[feature.color]} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
      <p className="text-slate-600 mb-6">{feature.description}</p>
      <div className="w-full bg-white rounded-lg border border-slate-200 p-3 h-32 overflow-hidden relative">
        {feature.icon === 'assignment' && <FormMockup />}
        {feature.icon === 'analytics' && <KanbanMockup />}
        {feature.icon === 'hub' && <NetworkMockup />}
      </div>
    </div>
  );
};

const FormMockup = () => (
  <div className="space-y-2 opacity-50">
    <div className="h-2 w-1/3 bg-slate-200 rounded"></div>
    <div className="h-8 w-full bg-slate-100 rounded border border-slate-200"></div>
    <div className="h-2 w-1/4 bg-slate-200 rounded"></div>
    <div className="h-8 w-full bg-slate-100 rounded border border-slate-200"></div>
    <div className="absolute bottom-2 right-2 bg-primary text-white text-[10px] px-2 py-1 rounded">Approved</div>
  </div>
);

const KanbanMockup = () => (
  <div className="flex gap-2">
    {['To Do', 'In Progress', 'Done'].map((col, i) => (
      <div key={i} className="flex-1 bg-slate-50 rounded p-1 flex flex-col gap-1">
        <div className="h-1.5 w-8 bg-slate-300 rounded mb-1"></div>
        <div className={`h-6 w-full bg-white border border-slate-200 rounded shadow-sm ${
          i === 1 ? 'border-l-2 border-l-yellow-400' : i === 2 ? 'border-l-2 border-l-green-400' : ''
        }`}></div>
        {i === 0 && (
          <>
            <div className="h-6 w-full bg-white border border-slate-200 rounded shadow-sm"></div>
            <div className="h-6 w-full bg-white border border-slate-200 rounded shadow-sm"></div>
          </>
        )}
      </div>
    ))}
  </div>
);

const NetworkMockup = () => (
  <div className="relative w-full h-full">
    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-8 h-8 bg-slate-100 rounded-full border border-slate-300 flex items-center justify-center">
      <span className="material-symbols-outlined text-xs text-slate-500">store</span>
    </div>
    <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-8 h-8 bg-primary/10 rounded-full border border-primary flex items-center justify-center">
      <span className="material-symbols-outlined text-xs text-primary">local_hospital</span>
    </div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 border-t-2 border-dashed border-slate-300"></div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-full border border-slate-200">
      <span className="material-symbols-outlined text-xs text-green-500">check</span>
    </div>
  </div>
);

export default Features;