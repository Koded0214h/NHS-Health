// components/Logos.jsx
import React from 'react';

const Logos = () => {
  const healthcareLogos = [
    {
      name: 'Mayo Clinic',
      color: '#0066b2',
      icon: '🏥',
      description: 'Leading academic medical center'
    },
    {
      name: 'Cleveland Clinic',
      color: '#004785',
      icon: '⚕️',
      description: 'World-renowned hospital system'
    },
    {
      name: 'Johnson & Johnson',
      color: '#d40026',
      icon: '💊',
      description: 'Global healthcare company'
    },
    {
      name: 'Medtronic',
      color: '#0066a1',
      icon: '🩺',
      description: 'Medical device company'
    },
    {
      name: 'CVS Health',
      color: '#cc0000',
      icon: '🏪',
      description: 'Healthcare retail chain'
    },
    {
      name: 'Walgreens',
      color: '#ce3537',
      icon: '💊',
      description: 'Pharmacy chain'
    }
  ];

  return (
    <section className="py-12 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-slate-900 text-lg font-semibold mb-2">Trusted by Leading Healthcare Providers</h2>
        <p className="text-slate-500 text-sm mb-8">Serving 150+ departments across 20+ facilities</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {healthcareLogos.map((logo, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${logo.color}15` }}
              >
                <div 
                  className="text-3xl"
                  style={{ color: logo.color }}
                >
                  {logo.icon}
                </div>
              </div>
              
              <h3 
                className="font-bold text-sm mb-1"
                style={{ color: logo.color }}
              >
                {logo.name}
              </h3>
              
              <p className="text-xs text-slate-500 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {logo.description}
              </p>
            </div>
          ))}
        </div>

        {/* Text logos for vendor platforms */}
        <div className="mt-12">
          <p className="text-slate-500 text-sm mb-6">Integrated with major healthcare platforms</p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            {[
              { name: 'EPIC', color: '#5a2d81' },
              { name: 'Cerner', color: '#0078c8' },
              { name: 'Meditech', color: '#1c8dd4' },
              { name: 'Allscripts', color: '#004785' },
              { name: 'Athenahealth', color: '#27aae1' }
            ].map((platform, index) => (
              <div 
                key={index}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <span 
                  className="font-bold text-lg tracking-tight"
                  style={{ color: platform.color }}
                >
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Logos;