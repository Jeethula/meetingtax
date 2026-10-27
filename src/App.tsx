import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { AuditPage } from './pages/AuditPage';
import { ReceiptPage } from './pages/ReceiptPage';
import { StatsPage } from './pages/StatsPage';
import { WhyPage } from './pages/WhyPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { detectUserCurrency, DEFAULT_CURRENCY } from './data/currencies';
import { track } from './lib/analytics';

export function App() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>(DEFAULT_CURRENCY);

  useEffect(() => {
    const detected = detectUserCurrency();
    setSelectedCurrency(detected);
  }, []);

  const handleCurrencyChange = (newCurr: string) => {
    setSelectedCurrency(newCurr);
    track('currency_changed', { currency: newCurr });
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#090A0C] text-[#FAF7F2] font-display selection:bg-[#FF3B1E] selection:text-white flex flex-col justify-between">
        {/* Navigation Bar */}
        <Navbar
          selectedCurrency={selectedCurrency}
          onCurrencyChange={handleCurrencyChange}
        />

        {/* Multi-Page Routes */}
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage selectedCurrency={selectedCurrency} />
              }
            />
            <Route
              path="/audit"
              element={
                <AuditPage
                  selectedCurrency={selectedCurrency}
                  onCurrencyChange={handleCurrencyChange}
                />
              }
            />
            <Route
              path="/receipt"
              element={
                <ReceiptPage
                  selectedCurrency={selectedCurrency}
                  onCurrencyChange={handleCurrencyChange}
                />
              }
            />
            <Route
              path="/stats"
              element={<StatsPage selectedCurrency={selectedCurrency} />}
            />
            <Route path="/why" element={<WhyPage />} />
            <Route path="/methodology" element={<MethodologyPage />} />
            {/* Fallback */}
            <Route
              path="*"
              element={<HomePage selectedCurrency={selectedCurrency} />}
            />
          </Routes>
        </main>

        {/* Global Footer */}
        <footer className="py-14 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto text-center border-t border-[#1C1E26] w-full">
          <div className="flex items-center justify-center space-x-2 font-mono text-sm font-bold text-[#F5EFEB] mb-2">
            <span>🧾 MEETINGTAX</span>
            <span className="text-[#FF3B1E]">·</span>
            <span>AUDIT YOUR CALENDAR</span>
          </div>
          <p className="text-xs font-mono text-[#636773] max-w-md mx-auto mb-6">
            A 100% client-side audit tool for builders and teams who value their time. Zero tracking, zero cookies, zero external API keys.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#888E9E]">
            <Link to="/" className="hover:text-[#F5EFEB] transition-colors">
              Home
            </Link>
            <span>·</span>
            <Link to="/audit" className="hover:text-[#F5EFEB] transition-colors">
              Take Audit
            </Link>
            <span>·</span>
            <Link to="/why" className="hover:text-[#F5EFEB] transition-colors">
              Why I Built This
            </Link>
            <span>·</span>
            <Link to="/stats" className="hover:text-[#F5EFEB] transition-colors">
              Research
            </Link>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
