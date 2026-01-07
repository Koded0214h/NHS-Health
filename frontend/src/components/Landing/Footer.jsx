// components/Footer.jsx
import React from 'react';

const Footer = () => {
  const sections = [
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Press', 'Contact']
    },
    {
      title: 'Product',
      links: ['Features', 'Security', 'Pricing', 'Case Studies']
    },
    {
      title: 'Resources',
      links: ['Blog', 'Help Center', 'API Docs', 'System Status']
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'HIPAA']
    }
  ];

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {sections.map((section, index) => (
            <div key={index}>
              <h5 className="text-white font-bold mb-4">{section.title}</h5>
              <ul className="space-y-2 text-sm">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a className="hover:text-white transition-colors" href="#">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">local_hospital</span>
            <span className="text-sm font-semibold text-slate-300">NHS Health</span>
          </div>
          
          <p className="text-xs text-slate-500">© 2026 NHS Health Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-red-400">favorite</span>
              Made for healthcare
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-green-400">lock</span>
              Data is secure
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;