// components/FinalCTA.jsx
import React from 'react';

const FinalCTA = () => {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Ready to Transform Your Hospital's Operations?
        </h2>
        <p className="text-blue-100 text-lg md:text-xl mb-10">
          Join the network of modern hospitals saving time and reducing errors with NHS Health.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="h-14 px-8 bg-white text-primary text-lg font-bold rounded-lg shadow-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
            Start Your Free Trial
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button className="h-14 px-8 bg-transparent border-2 border-white/30 text-white text-lg font-bold rounded-lg hover:bg-white/10 transition-colors">
            Schedule a Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;