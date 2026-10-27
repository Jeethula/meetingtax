import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STATS } from '../data/stats';
import { ExternalLink, Users, AlertCircle } from 'lucide-react';
import { CURRENCIES } from '../data/currencies';
import { formatCurrency } from '../lib/format';

gsap.registerPlugin(ScrollTrigger);

interface PainScrollProps {
  selectedCurrency: string;
}

export const PainScroll: React.FC<PainScrollProps> = ({ selectedCurrency }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const beatsRef = useRef<(HTMLDivElement | null)[]>([]);
  const curr = CURRENCIES[selectedCurrency] || CURRENCIES.INR;

  // Running cost ticker for the 8-person rhetorical illustration
  const [illustrationMins, setIllustrationMins] = useState(45);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate each stat card into view as the user scrolls through
      beatsRef.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'top 45%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Compute cost for 8 avatars (2 needed, 6 watching)
  const hourlyRate = curr.defaultHourlyRate * curr.defaultLoadedMultiplier;
  const costPerMinPerPerson = hourlyRate / 60;
  const totalCost = 8 * illustrationMins * costPerMinPerPerson;
  const wastedCost = 6 * illustrationMins * costPerMinPerPerson;

  return (
    <section
      id="stats-section"
      ref={containerRef}
      className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-b border-[#21232A]"
    >
      {/* Section Header */}
      <div className="mb-20 max-w-3xl">
        <div className="font-mono text-xs uppercase tracking-widest text-[#FF3B1E] font-bold mb-3">
          SECTION B // EMPIRICAL EVIDENCE
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-headline text-[#F5EFEB] mb-4">
          The Anatomy of Calendar Inflation.
        </h2>
        <p className="text-base sm:text-xl text-[#888E9E]">
          We didn’t make these numbers up. Top business researchers and software telemetry have been tracking the hemorrhage for years.
        </p>
      </div>

      {/* Stat Beats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {STATS.map((stat, idx) => {
          if (stat.isIllustration) {
            // Rhetorical 8-avatar room beat
            return (
              <div
                key={stat.id}
                ref={(el) => { beatsRef.current[idx] = el; }}
                className="col-span-1 md:col-span-2 bg-[#121316] border-2 border-[#FF3B1E]/60 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
                  <div className="inline-flex items-center space-x-2 bg-[#FF3B1E]/15 border border-[#FF3B1E]/30 text-[#FF3B1E] px-3 py-1 rounded text-xs font-mono font-bold tracking-wider uppercase">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Rhetorical Illustration · Not a survey statistic</span>
                  </div>
                  <div className="font-mono text-xs text-[#888E9E]">
                    FIG. 1: THE 8-PERSON SYNC
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7">
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-headline text-[#FAF7F2] mb-3">
                      {stat.claim}
                    </h3>
                    <p className="text-sm sm:text-base text-[#888E9E] mb-6 leading-relaxed">
                      {stat.context}
                    </p>

                    {/* Attendees Visualizer (2 bright, 6 dimmed) */}
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-6">
                      {Array.from({ length: 8 }).map((_, i) => {
                        const isDecider = i < 2;
                        return (
                          <div
                            key={i}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                              isDecider
                                ? 'bg-[#FF3B1E]/15 border-[#FF3B1E] text-[#FF3B1E]'
                                : 'bg-[#18191E] border-[#2A2D37] text-[#555866] opacity-60'
                            }`}
                          >
                            <Users className="w-6 h-6 mb-1" />
                            <span className="font-mono text-[10px] font-bold">
                              {isDecider ? 'DECIDING' : 'IDLE'}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center space-x-4 text-xs font-mono text-[#888E9E]">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B1E]" />
                        <span>2 Essential decision-makers</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#555866]" />
                        <span>6 Audience passengers</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Meter */}
                  <div className="lg:col-span-5 bg-[#17181D] border border-[#2B2D38] rounded-xl p-5 sm:p-6">
                    <div className="flex justify-between items-baseline text-xs font-mono text-[#888E9E] mb-2">
                      <span>SYNC DURATION:</span>
                      <span className="font-bold text-[#F5EFEB]">{illustrationMins} min</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={90}
                      step={15}
                      value={illustrationMins}
                      onChange={(e) => setIllustrationMins(Number(e.target.value))}
                      className="w-full accent-[#FF3B1E] cursor-pointer h-1.5 bg-[#262830] rounded mb-3"
                    />
                    <div className="text-xs font-mono text-[#888E9E] mb-1">
                      TOTAL RUNNING COST:
                    </div>
                    <div className="font-mono text-3xl font-extrabold text-[#F5EFEB] tabular-nums mb-3">
                      {formatCurrency(totalCost, selectedCurrency)}
                    </div>
                    <div className="border-t border-[#262830] pt-3">
                      <div className="text-[11px] font-mono text-[#888E9E] uppercase">
                        Waste paid to passive spectators (75%):
                      </div>
                      <div className="font-mono text-xl font-bold text-[#FF3B1E] tabular-nums">
                        {formatCurrency(wastedCost, selectedCurrency)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Standard Research Stat Beat
          return (
            <div
              key={stat.id}
              ref={(el) => { beatsRef.current[idx] = el; }}
              className="bg-[#121316] border border-[#21232A] rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#333642] transition-colors shadow-lg"
            >
              <div>
                <div className="flex items-baseline space-x-2 mb-4">
                  <span className="font-mono text-5xl sm:text-6xl font-black text-[#FF3B1E] tabular-nums tracking-tighter">
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="font-mono text-lg text-[#888E9E] font-medium">
                      {stat.unit}
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-headline text-[#F5EFEB] mb-3 leading-snug">
                  {stat.claim}
                </h3>

                <p className="text-sm text-[#888E9E] leading-relaxed mb-6">
                  {stat.context}
                </p>
              </div>

              {/* Source citation */}
              <div className="pt-4 border-t border-[#1E2027] flex items-center justify-between text-xs font-mono text-[#636773]">
                <span className="line-clamp-1 pr-2">{stat.source}</span>
                <a
                  href={stat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F5EFEB] transition-colors inline-flex items-center flex-shrink-0"
                  aria-label={`View study: ${stat.source}`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
