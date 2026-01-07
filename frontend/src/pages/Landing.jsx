// App.jsx
import React from 'react';

import Header from '../components/Landing/Header';
import Hero from '../components/Landing/Hero';
import Logos from '../components/Landing/Logos';
import Features from '../components/Landing/Features';
import HowItWorks from '../components/Landing/HowItWorks';
import RoleBenefits from '../components/Landing/RoleBenefits';
import SecurityCompliance from '../components/Landing/SecurityCompliance';
import Pricing from '../components/Landing/Pricing';
import Testimonial from '../components/Landing/Testimonial';
import PortalLogin from '../components/Landing/PortalLogin';
import FinalCTA from '../components/Landing/FinalCTA';
import Footer from '../components/Landing/Footer';

function Landing() {
  return (
    <div className="bg-background-light text-slate-800 font-display antialiased overflow-x-hidden scroll-smooth">
      <Header />
      <Hero />
      <Logos />
      <Features />
      <HowItWorks />
      <RoleBenefits />
      <SecurityCompliance />
      <Pricing />
      <Testimonial />
      <PortalLogin />
      <FinalCTA />
      <Footer />
    </div>
  );
}

export default Landing;