// components/Testimonial.jsx
import React from 'react';

const Testimonial = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-slate-100 text-center">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="material-symbols-outlined fill-current text-yellow-400 text-xl">star</span>
            ))}
          </div>
          
          <h3 className="text-2xl md:text-3xl font-medium text-slate-900 italic mb-8">
            "NHS Health completely transformed our inventory management. We cut waste by 40% in the first quarter alone."
          </h3>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden mb-3">
              <img 
                alt="James Wilson" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlb_Pimuvz4iJnNg8jUEa5vkIX0flVX4JnFPD03Ge3HNMGR7OB3iRRBLgC76cLx7BbJXH7aepj91pWxZ6li6Bo62zbUKGVR4cDT5F4JgiHGHKbKL2wFjgwgL-CJ4TsAhkfVebyPajBmKmP5L7hhSknzs0axDU_Zpbto25WgSDyTbPAGiD6ac9NwgOqgJ8pqMTOssffW1PoGgj_jz6s6Aa3z8XSgqvZpDdxxK2edjNLIsodRCoqDlX-xq2nd_s7C84yDc7sv4df7STa" 
              />
            </div>
            <p className="font-bold text-slate-900">James Wilson</p>
            <p className="text-sm text-slate-500">Director of Operations, St. Jude's Medical Center</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;