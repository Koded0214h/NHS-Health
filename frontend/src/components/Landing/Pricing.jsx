// components/Pricing.jsx
import React from 'react';

const Pricing = () => {
  const plans = [
    {
      name: 'Essential Plan',
      tagline: 'For small clinics and individual departments.',
      price: '$299',
      period: '/month',
      features: [
        'Up to 25 Users',
        'Basic Approval Workflows',
        'Email Support',
        '1 Year Data Retention'
      ],
      cta: 'Start Free Trial',
      isPopular: false,
      color: 'white'
    },
    {
      name: 'Enterprise Plan',
      tagline: 'For multi-facility hospitals and networks.',
      price: 'Custom',
      period: '',
      features: [
        'Unlimited Users & Depts',
        'Advanced Custom Workflows',
        'Dedicated Success Manager',
        'Unlimited Data Retention',
        'Vendor Portal Access'
      ],
      cta: 'Request Custom Quote',
      isPopular: true,
      color: 'primary'
    }
  ];

  return (
    <section className="py-24 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-600">Choose the plan that fits your facility size.</p>
        </div>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingCard = ({ plan }) => {
  return (
    <div className={`bg-white rounded-2xl p-8 border ${plan.isPopular ? 'border-2 border-primary shadow-2xl relative transform md:-translate-y-4' : 'border-slate-200 shadow-lg'} relative`}>
      {plan.isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          Most Popular
        </div>
      )}
      
      <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
      <p className="text-sm text-slate-500 mt-2">{plan.tagline}</p>
      
      <div className="my-6">
        <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
        {plan.period && <span className="text-slate-500">{plan.period}</span>}
      </div>
      
      <ul className="space-y-3 mb-8 text-sm text-slate-600">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="material-symbols-outlined text-green-500 text-lg">check</span>
            {feature}
          </li>
        ))}
      </ul>
      
      <button className={`w-full h-12 ${plan.isPopular ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-white border-2 border-primary text-primary hover:bg-blue-50'} font-bold rounded-lg transition-colors shadow-lg ${plan.isPopular ? 'shadow-primary/25' : ''}`}>
        {plan.cta}
      </button>
      
      <p className="text-xs text-center text-slate-400 mt-4">
        {plan.isPopular ? '30-day free trial available' : 'No credit card required'}
      </p>
    </div>
  );
};

export default Pricing;