// components/SecurityCompliance.jsx
import React from 'react';

const SecurityCompliance = () => {
  const securityFeatures = [
    { icon: 'lock', title: 'End-to-end encryption', desc: 'Data is encrypted in transit and at rest.' },
    { icon: 'admin_panel_settings', title: 'Role-based Access', desc: 'Granular permission controls.' },
    { icon: 'history_edu', title: 'Audit Log Protection', desc: 'Immutable logs for all actions.' },
    { icon: 'cloud_done', title: 'SOC 2 Type II', desc: 'Compliant infrastructure.' },
  ];

  const complianceFeatures = [
    {
      title: 'HIPAA Compliant',
      desc: 'Built to handle PHI with strict adherence to privacy rules.'
    },
    {
      title: 'Customizable Retention Policies',
      desc: 'Set data deletion rules based on your hospital\'s policy.'
    },
    {
      title: 'Exportable Audit Trails',
      desc: 'One-click export for regulatory inspections.'
    },
  ];

  return (
    <section className="py-20 bg-background-light border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Security Section */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">shield_lock</span>
              Enterprise-Grade Security
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="material-symbols-outlined text-slate-400 mb-2">{feature.icon}</span>
                  <h4 className="font-bold text-slate-800 text-sm">{feature.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance Section */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-green-600 text-3xl">policy</span>
              Healthcare Compliance Ready
            </h3>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-full">
              <ul className="space-y-4">
                {complianceFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-green-500 mt-0.5">check_circle</span>
                    <div>
                      <strong className="block text-slate-900">{feature.title}</strong>
                      <span className="text-sm text-slate-500">{feature.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityCompliance;