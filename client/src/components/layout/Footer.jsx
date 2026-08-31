import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 mt-12 border-t border-border/50 text-center text-text-muted text-sm">
      <div className="container mx-auto px-4">
        <p>GaanaSpot © {new Date().getFullYear()} • Made with <span className="text-error">♥</span> for Bollywood lovers</p>
      </div>
    </footer>
  );
};

export default Footer;
