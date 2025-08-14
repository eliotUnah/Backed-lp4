import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Benefits from "./Benefits";
import Testimonials from "./Testimonials";
import Footer from "./Footer";
import CTA from './CTA';
import '../styles/Landing.css';

const LandingPage = () => {
  return (
    <div className="Landing-Page">
      <Navbar />
       <main>
      <HeroSection />
      <Benefits />
      <Testimonials />
      <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
