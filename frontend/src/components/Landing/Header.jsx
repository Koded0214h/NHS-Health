// components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">local_hospital</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 text-xl font-bold leading-none tracking-tight">NHS Health</h1>
              <span className="text-xs text-slate-500 font-medium tracking-wide">Networked Health Services</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <a className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="#features">
              Features
            </a>
            <a className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="#how-it-works">
              How It Works
            </a>
            <a className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="#pricing">
              Pricing
            </a>
            <a className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="#">
              Contact
            </a>
            <a className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="#">
              Blog
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link to='/login' >
              <button className="hidden sm:flex items-center justify-center h-10 px-5 text-sm font-semibold text-slate-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                Login
              </button>
            </Link>
            <button className="flex items-center justify-center h-10 px-5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-lg shadow-md shadow-primary/20 transition-all transform hover:scale-[1.02]">
              Request Demo
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;