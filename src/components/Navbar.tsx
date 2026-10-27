import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CURRENCIES } from '../data/currencies';

interface NavbarProps {
  selectedCurrency: string;
  onCurrencyChange: (curr: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCurrency,
  onCurrencyChange,
}) => {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/audit', label: 'Take Audit' },
    { to: '/why', label: 'Why I Built This' },
    { to: '/stats', label: 'Research' },
  ];

  return (
    <header className="border-b border-[#21232A] bg-[#090A0C]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded bg-[#F5EFEB] flex items-center justify-center text-[#111215] font-mono font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
            🧾
          </div>
          <div>
            <div className="font-mono font-extrabold text-sm sm:text-base tracking-widest text-[#F5EFEB]">
              MEETINGTAX<span className="text-[#FF3B1E]">.APP</span>
            </div>
            <div className="font-mono text-[10px] tracking-wider text-[#888E9E]">
              CALENDAR AUDIT LEDGER
            </div>
          </div>
        </Link>

        {/* Navigation Routes */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1D1E24] text-[#FF3B1E] font-bold border border-[#FF3B1E]/30'
                    : 'text-[#888E9E] hover:text-[#F5EFEB] hover:bg-[#15171C]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Currency Selector */}
        <div className="flex items-center space-x-2 bg-[#17181D] px-2.5 py-1.5 rounded-lg border border-[#262830]">
          <span className="font-mono text-[11px] text-[#888E9E] hidden md:inline">CURRENCY:</span>
          <select
            value={selectedCurrency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            className="bg-transparent font-mono text-xs text-[#F5EFEB] focus:outline-none cursor-pointer"
            aria-label="Select currency"
          >
            {Object.values(CURRENCIES).map((c) => (
              <option key={c.code} value={c.code} className="bg-[#121316] text-[#F5EFEB]">
                {c.code} ({c.symbol.trim()})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
