// LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('clinician');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { ...formData, role: activeTab });

    navigate('/admin');

    // Add your login logic here
  };

  const renderPlaceholder = () => {
    if (activeTab === 'clinician') {
      return "e.g. j.doe@hospital.org";
    } else if (activeTab === 'administrator') {
      return "e.g. admin@hospital.org";
    }
    return "Enter your email";
  };

  return (
    <div className="bg-background-light min-h-screen flex flex-col font-display">
      {/* Header / Top Bar */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm px-8 py-4 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">local_hospital</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 text-xl font-bold leading-none tracking-tight">NHS Health</h1>
            <span className="text-xs text-slate-500 font-medium tracking-wide">Networked Health Services</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">help</span>
            <span>Help/Support</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center bg-white shadow-xl z-10 p-8 md:p-12 lg:p-16 overflow-y-auto">
          <div className="max-w-md w-full mx-auto space-y-8">
            {/* Branding & Welcome */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sign in</h1>
              <p className="text-slate-500">Access the requisition portal securely.</p>
            </div>

            {/* Role Selection Tabs */}
            <div className="w-full">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Select Portal</p>
              <div className="flex border-b border-slate-200 w-full">
                <button 
                  onClick={() => handleTabClick('clinician')}
                  className={`group flex-1 flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 focus:outline-none transition-colors ${
                    activeTab === 'clinician' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span className="text-sm font-bold leading-normal tracking-wide">Clinician</span>
                  <span className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Doctors, Nurses, Department Staff
                  </span>
                </button>
                <button 
                  onClick={() => handleTabClick('administrator')}
                  className={`group flex-1 flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 focus:outline-none transition-colors ${
                    activeTab === 'administrator' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span className="text-sm font-bold leading-normal tracking-wide">Administrator</span>
                  <span className="text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    HODs, Operations, Inventory Managers
                  </span>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <label className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      {activeTab === 'clinician' ? 'stethoscope' : 'admin_panel_settings'}
                    </span>
                    <p className="text-slate-900 text-sm font-semibold leading-normal">
                      {activeTab === 'clinician' ? 'Clinician ID / Email' : 'Administrator ID / Email'}
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">badge</span>
                    </span>
                    <input 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-lg text-slate-900 border border-slate-200 bg-slate-50 focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-10 pr-4 placeholder:text-slate-400 text-base transition-shadow" 
                      placeholder={renderPlaceholder()} 
                      type="text"
                      required
                    />
                  </div>
                </label>
                
                <label className="block">
                  <div className="flex justify-between items-center pb-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">lock</span>
                      <p className="text-slate-900 text-sm font-semibold leading-normal">Password</p>
                    </div>
                    <a className="text-primary text-sm font-semibold hover:underline" href="#">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </span>
                    <input 
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full rounded-lg text-slate-900 border border-slate-200 bg-slate-50 focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-10 pr-4 placeholder:text-slate-400 text-base transition-shadow" 
                      placeholder="Enter your password" 
                      type="password"
                      required
                    />
                  </div>
                </label>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary border-slate-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                    Remember this device
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 h-12 rounded-lg bg-primary text-white text-base font-bold shadow-md hover:bg-primary-dark transition-all focus:ring-2 focus:ring-offset-2 focus:ring-primary transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[20px]">login</span>
                <span>Sign In as {activeTab === 'clinician' ? 'Clinician' : 'Administrator'}</span>
              </button>

              {/* Role-specific info */}
              <div className={`p-4 rounded-lg border transition-all duration-300 ${
                activeTab === 'clinician' 
                  ? 'bg-blue-50 border-blue-100' 
                  : 'bg-purple-50 border-purple-100'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary mt-0.5">
                    {activeTab === 'clinician' ? 'info' : 'verified_user'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800 mb-1">
                      {activeTab === 'clinician' 
                        ? 'Clinician Access' 
                        : 'Administrator Access'}
                    </p>
                    <p className="text-xs text-slate-600">
                      {activeTab === 'clinician'
                        ? 'Submit requisitions, track orders, and confirm deliveries for your department.'
                        : 'Approve requests, manage inventory, oversee departments, and access analytics.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
                <span className="material-symbols-outlined text-[16px]">lock_clock</span>
                <span>Secure Connection · 256-bit Encryption</span>
              </div>
            </form>

            {/* Footer Links */}
            <div className="pt-6 border-t border-slate-100 flex flex-col gap-2">
              <p className="text-sm text-slate-600 text-center">
                New staff member? <a className="text-primary font-semibold hover:underline" href="#">Contact IT Support</a>
              </p>
              <p className="text-xs text-slate-500 text-center">
                Looking for vendor portal? <a className="text-primary font-semibold hover:underline" href="https://store.nhs-health.com">Go to store.nhs-health.com</a>
              </p>
            </div>
          </div>

          <div className="mt-auto pt-8 flex justify-center text-xs text-slate-400">
            <p>© 2024 NHS Health. All rights reserved.</p>
          </div>
        </div>

        {/* Right Side: Hero Visual */}
        <div className="hidden md:flex md:w-1/2 relative bg-slate-100 items-center justify-center overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute inset-0 z-0">
            <img 
              alt="Clean modern hospital corridor with soft blue lighting and blurred medical professionals walking" 
              className="w-full h-full object-cover opacity-90 filter brightness-[1.05]" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBQqYkC39Fy_P9Efi-6BlWE69ViDq7DHpOwphwM0AFkUi4vgQEEi3EtPzhHy-Kphw3a6UDprqW9LBBolD2xutorKZStU3U69C_hvtDTIsmdEMU3wVeVA4F1TAwUYMjNxWb1porHtRZtNFy2H16KDX92f9xOZdHvfhbjRGmWzlDfy4AW9IcPPgV2SHf6bf3mSwR2vILW_EZtcbq61cNjuv-ovWnI_b6rgrPr9jY7iVdXg02Ay6V0LyynIigkqGROxSBT2yT-u6edq7Z" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 max-w-md p-8 text-white drop-shadow-lg">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
              <div className="mb-6">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 ${
                  activeTab === 'clinician' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                }`}>
                  <span className="material-symbols-outlined text-sm">
                    {activeTab === 'clinician' ? 'stethoscope' : 'admin_panel_settings'}
                  </span>
                  <span className="text-sm font-semibold">
                    {activeTab === 'clinician' ? 'Clinician Portal' : 'Administrator Portal'}
                  </span>
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  {activeTab === 'clinician' 
                    ? 'Clinical Staff Portal' 
                    : 'Administrative Portal'}
                </h2>
                <p className="text-lg font-medium opacity-90 leading-relaxed mb-6">
                  {activeTab === 'clinician'
                    ? 'Submit and track medical supply requests directly from your department. Focus on patient care while we handle the logistics.'
                    : 'Manage hospital-wide inventory, approve requests, and monitor department performance from a centralized dashboard.'}
                </p>
              </div>
              
              {/* Role-specific features */}
              <div className="space-y-4">
                {activeTab === 'clinician' ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-300">add_circle</span>
                      </div>
                      <div>
                        <p className="font-medium">Submit Requests</p>
                        <p className="text-sm opacity-80">Quickly request supplies with priority levels</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-300">track_changes</span>
                      </div>
                      <div>
                        <p className="font-medium">Track Status</p>
                        <p className="text-sm opacity-80">Real-time updates on your requisitions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-300">check_circle</span>
                      </div>
                      <div>
                        <p className="font-medium">Confirm Delivery</p>
                        <p className="text-sm opacity-80">Verify received items with digital signature</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-300">approval</span>
                      </div>
                      <div>
                        <p className="font-medium">Approve Requests</p>
                        <p className="text-sm opacity-80">Review and approve departmental requisitions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-300">analytics</span>
                      </div>
                      <div>
                        <p className="font-medium">Monitor Analytics</p>
                        <p className="text-sm opacity-80">Track department spending and inventory</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-300">verified</span>
                      </div>
                      <div>
                        <p className="font-medium">Audit Compliance</p>
                        <p className="text-sm opacity-80">Full audit trail for all transactions</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;