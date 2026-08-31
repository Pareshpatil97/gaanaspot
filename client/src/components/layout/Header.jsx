import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music2, Menu, X, Gamepad2, Target, Trophy, Sparkles } from 'lucide-react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: Sparkles },
    { to: '/play', label: 'Play', icon: Gamepad2 },
    { to: '/practice', label: 'Practice', icon: Target },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <header className="fixed top-0 w-full z-40 glass-panel border-b-0 border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
              <Music2 className="text-primary w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              GaanaSpot
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:text-white hover:bg-surface-hover transition-all font-medium"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right — Challenge button */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/challenge/create" className="btn-primary text-sm px-4 py-2">
              ⚡ Challenge
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 text-text-secondary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-border absolute w-full left-0 animate-slideDown">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface-hover text-text-secondary hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            ))}
            <div className="h-px bg-border my-2"></div>
            <Link
              to="/challenge/create"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-3 rounded-lg hover:bg-surface-hover text-primary font-medium"
            >
              ⚡ Challenge a Friend
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
