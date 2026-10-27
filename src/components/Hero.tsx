import React, { useEffect, useState } from 'react';
import { CURRENCIES } from '../data/currencies';
import { formatCurrency } from '../lib/format';
import { ArrowDown, Clock, ShieldAlert } from 'lucide-react';

interface HeroProps {
  selectedCurrency: string;
  onCtaClick: () => void;
  onStatsClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  selectedCurrency,
  onCtaClick,
  onStatsClick,
}) => {
  // Live ticking counter simulating an active corporate meeting with 8 attendees
  const [elapsedSeconds, setElapsedSeconds] = useState(1);
  const curr = CURRENCIES[selectedCurrency] || CURRENCIES.INR;

  // Assume 8 people in an average sync with loaded rate
  const attendees = 8;
  const costPerHour = attendees * curr.defaultHourlyRate * curr.defaultLoadedMultiplier;
  const costPerSecond = costPerHour / 3600;
  const liveCost = elapsedSeconds * costPerSecond;

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex flex-col justify-center py-6 sm:py-10 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto border-b border-[#21232A]">


      {/* Main Hero Content */}
      <div className="py-6 sm:py-10 max-w-4xl">
        {/* Subtle Tax Badge */}
        <div className="inline-flex items-center space-x-2 bg-[#17181D] border border-[#333642] px-3 py-1 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-[#FF3B1E] animate-pulse" />
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#D0D4DD] uppercase">
            The Unofficial Corporate Waste Registry
          </span>
        </div>

        {/* Massive Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] font-headline text-[#FAF7F2] mb-6">
          Most of this meeting <br />
          <span className="text-[#FF3B1E] underline decoration-2 underline-offset-8">
            didn't need you.
          </span>
        </h1>

        {/* Blunt Subline */}
        <p className="text-base sm:text-xl text-[#B8BCC8] font-normal max-w-2xl leading-relaxed mb-8">
          Usually 2 people decide. Everyone else watches the clock — and the company pays for it.
        </p>

        {/* Live Ticker Card */}
        <div className="bg-[#121316] border border-[#262830] rounded-xl p-4 sm:p-5 mb-8 max-w-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FF3B1E]" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#888E9E] uppercase tracking-wider mb-1">
                <Clock className="w-3.5 h-3.5 text-[#FF3B1E]" />
                <span>Simulated 8-person sync running:</span>
                <span className="text-[#FAF7F2] font-semibold">{elapsedSeconds}s</span>
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-[#F5EFEB] tabular-nums tracking-tight">
                {formatCurrency(liveCost, selectedCurrency, { hideDecimals: false })}
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-[#262830] sm:pl-6">
              <span className="font-mono text-[11px] text-[#888E9E] block">
                BURNING PAYROLL AT
              </span>
              <span className="font-mono text-sm font-semibold text-[#FF3B1E] tabular-nums">
                {formatCurrency(costPerSecond * 60, selectedCurrency, { hideDecimals: false })} / min
              </span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={onCtaClick}
            className="px-7 py-3.5 bg-[#FF3B1E] hover:bg-[#E62E12] text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase rounded-lg shadow-lg hover:shadow-[#FF3B1E]/20 transition-all flex items-center justify-center space-x-3 cursor-pointer group active:scale-[0.98]"
          >
            <span>Show me my number</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            onClick={onStatsClick}
            className="px-5 py-3.5 bg-transparent hover:bg-[#17181D] text-[#B8BCC8] hover:text-white font-mono text-xs sm:text-sm tracking-wide transition-colors border border-transparent hover:border-[#262830] rounded-lg cursor-pointer text-center"
          >
            See the research & stats →
          </button>
        </div>
      </div>

      {/* Hero Footnote Bar */}
    </section>
  );
};
