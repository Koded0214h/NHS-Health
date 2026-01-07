
// components/RoleBenefits.jsx
import React from 'react';

const RoleBenefits = () => {
  const personas = [
    {
      name: 'Sarah Jenkins',
      role: 'Hospital Administrator',
      quote: '"The audit trails have saved us countless hours during compliance checks. It\'s peace of mind I didn\'t know we needed."',
      benefit: 'Reduce Operational Costs',
      icon: 'trending_up',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDugai-RWJ2dtBVs__cmGYGjPZstRDOd5N34K3zMHlGjAZnqKrAKwHNCKyy5xXoTIKFDLt9uoKacRMQ4sIRv9cCm63P9gLV5bKlB80VyrOUAxFnQArFR7X5vXIstA25DFrKKD6cbjl8t1YvsCBFy2XVLwSdPl_Vs9fwsbUn595ulEMRDd5nMEAPYJ4uMh3fi0pdjizSycLHelWmXyGutSY1BaZMFimNQtxN_wsslS9nBGUROBv64-yna8FSrT2_exsqFmA9jDQXEIq8'
    },
    {
      name: 'Dr. Emily Chen',
      role: 'Head of Cardiology',
      quote: '"My team spends less time filling out forms and more time with patients. Approvals happen in minutes, not days."',
      benefit: 'Reclaim Clinical Time',
      icon: 'schedule',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWOB5ZfunTrVasI8xsmdeGRZhvgCxP-6YmgRClO_z7NFLDxEvy9MwFhlOnyK4o2WSf3KuKos-tRO-RxAJbAtZk_ZSJ7B42I2SRwbqoUjyYv3v6KrNhM70IhBApgfO9-OBx4840PEJSrxeS56sd-m9iVOnAVLiRJ-l6PTfOu5zE795ZVclbJ5I8mc6kmXZxrv1s0UVebTPbu1PbByT1xKWlp42Cn3LHgp4j8hfEC2kA9GLx6qMSKZL1fChjbNIj5rgH64e0qH96ZTqZ'
    },
    {
      name: 'Mark Thompson',
      role: 'Inventory Manager',
      quote: '"Stockouts are a thing of the past. The vendor portal keeps our suppliers perfectly synced with our needs."',
      benefit: 'Optimize Inventory Levels',
      icon: 'inventory',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAb3B9zG0beK2NVwO2H-pJOgIK9sv6xkdLSDSOQsrhEMxKe5SMhTNcYHBejsXev44w75hwsIa5eerZFYjq8Kw5OG0wdrBiZC3z3wYZT8pU7xYp7Os33QPskcfNKRLTTxnV9rRXds9RZytvLr0b7mzkcDN0goGF6iiXkqHNoIObADyiCiUlJH2c-PQznzkIj7036yjzu_K12NYpxYCph4sYAdGCrpwkCCzmU-4gHk4FxVTwQoP0clV_s2-K-lha9iRIGdZcB61o_MYI_'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Built for Every Hospital Role</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {personas.map((persona, index) => (
            <PersonaCard key={index} persona={persona} />
          ))}
        </div>
      </div>
    </section>
  );
};

const PersonaCard = ({ persona }) => {
  return (
    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
          <img 
            alt={persona.name} 
            className="w-full h-full object-cover" 
            src={persona.image} 
          />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">{persona.name}</h4>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{persona.role}</p>
        </div>
      </div>
      
      <blockquote className="text-slate-600 italic mb-6 flex-grow">
        {persona.quote}
      </blockquote>
      
      <div className="pt-4 border-t border-slate-200">
        <p className="text-sm font-bold text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-base">{persona.icon}</span>
          {persona.benefit}
        </p>
      </div>
    </div>
  );
};

export default RoleBenefits;