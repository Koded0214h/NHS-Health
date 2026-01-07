// components/PortalLogin.jsx
import React from 'react';

const PortalLogin = () => {
  const portals = [
    {
      icon: 'domain',
      title: 'Hospital Staff Portal',
      description: 'Access your requisitions, approvals, and inventory dashboard.',
      cta: 'Login to App',
      color: 'blue',
      bg: 'slate-50',
      text: 'slate-900',
      buttonColor: 'primary'
    },
    {
      icon: 'storefront',
      title: 'Vendor Partner Portal',
      description: 'Manage orders, update stock availability, and track deliveries.',
      cta: 'Login to Vendor Portal',
      color: 'white',
      bg: 'slate-900',
      text: 'white',
      buttonColor: 'white'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Already Using NHS Health?</h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {portals.map((portal, index) => (
            <PortalCard key={index} portal={portal} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PortalCard = ({ portal }) => {
  return (
    <div className={`group bg-${portal.bg} border border-${portal.bg === 'slate-900' ? 'slate-800' : 'slate-200'} hover:border-${portal.bg === 'slate-900' ? 'slate-700' : 'primary/50'} rounded-2xl p-8 flex flex-col items-center text-center transition-all hover:shadow-lg`}>
      <div className={`w-16 h-16 ${portal.bg === 'slate-900' ? 'bg-slate-800' : 'bg-blue-100'} rounded-full flex items-center justify-center ${portal.bg === 'slate-900' ? 'text-white' : 'text-primary'} mb-6`}>
        <span className="material-symbols-outlined text-4xl">{portal.icon}</span>
      </div>
      
      <h3 className={`text-xl font-bold ${portal.text} mb-2`}>{portal.title}</h3>
      <p className={`${portal.bg === 'slate-900' ? 'text-slate-400' : 'text-slate-600'} mb-6 text-sm`}>
        {portal.description}
      </p>
      
      <a href="#" className={`inline-flex items-center justify-center h-10 px-6 ${portal.buttonColor === 'primary' ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-white text-slate-900 hover:bg-slate-100'} font-semibold rounded-lg transition-colors w-full sm:w-auto`}>
        {portal.cta}
        <span className="material-symbols-outlined ml-2 text-sm">login</span>
      </a>
    </div>
  );
};

export default PortalLogin;