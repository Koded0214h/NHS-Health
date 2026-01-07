// components/Hero.jsx
import React from 'react';

const Hero = () => {
  return (
    <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden bg-white">
      {/* Background decorative blob */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-8 max-w-2xl">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 w-fit">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">New v2.0 Dashboard Live</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight">
                Digitize Your Hospital Requisitions.{' '}
                <span className="text-gradient">End Paperwork Chaos.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                Reduce requisition time by 70%, ensure complete audit trail compliance, and gain real-time inventory visibility across all departments.
              </p>
            </div>
            
            <ul className="grid sm:grid-cols-2 gap-3">
              {['Audit trail compliance', 'Real-time visibility', 'Vendor coordination', '70% faster processing'].map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-slate-700 font-medium">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  {item}
                </li>
              ))}
            </ul>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <button className="h-12 px-8 bg-primary hover:bg-primary-dark text-white text-base font-bold rounded-lg shadow-lg shadow-primary/25 transition-all flex items-center gap-2">
                Get Started Free for 30 Days
              </button>
              <button className="h-12 px-6 bg-white border border-slate-200 hover:border-primary/50 text-slate-700 hover:text-primary text-base font-bold rounded-lg transition-all flex items-center gap-2 group">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">play_circle</span>
                Watch 2-Minute Demo
              </button>
            </div>
            
            <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-green-500 text-[18px]">verified_user</span>
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">lock</span>
                Bank-level Security
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">support_agent</span>
                24/7 Support
              </div>
            </div>
          </div>

          {/* Right Content (Simple Dashboard Mockup) */}
          <div className="relative w-full aspect-[4/3] lg:aspect-square flex items-center justify-center">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

const DashboardMockup = () => {
  return (
    <div className="relative w-full h-auto rounded-2xl shadow-2xl overflow-hidden border border-slate-200/60 bg-white">
      {/* Browser header */}
      <div className="h-8 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
        </div>
      </div>
      
      {/* Simple dashboard content */}
      <div className="p-6 bg-white">
        {/* Simple stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-2xl font-bold text-slate-900">48</div>
            <div className="text-sm text-slate-600">Active Requests</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="text-2xl font-bold text-slate-900">12</div>
            <div className="text-sm text-slate-600">Pending Approval</div>
          </div>
        </div>
        
        {/* Simple activity list */}
        <div className="space-y-3">
          {[
            { text: 'Dr. Sarah approved ICU supplies', time: '5m ago', color: 'bg-green-100 text-green-700' },
            { text: 'New request from Surgery Dept', time: '12m ago', color: 'bg-blue-100 text-blue-700' },
            { text: 'Medication delivered to Ward B', time: '25m ago', color: 'bg-purple-100 text-purple-700' }
          ].map((item, index) => (
            <div key={index} className={`p-3 rounded-lg ${item.color}`}>
              <div className="font-medium text-sm">{item.text}</div>
              <div className="text-xs opacity-70 mt-1">{item.time}</div>
            </div>
          ))}
        </div>
        
        {/* Simple chart placeholder */}
        <div className="mt-6 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-900">Weekly Activity</div>
            <div className="text-xs text-slate-500">ICU</div>
          </div>
          <div className="flex items-end h-12 gap-1">
            {[30, 50, 40, 70, 60].map((height, i) => (
              <div 
                key={i} 
                className="flex-1 bg-primary/30 rounded-t-lg"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;