import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import {
  ArrowRight,
  Terminal,
} from 'lucide-react';

interface HomePageProps {
  selectedCurrency: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  selectedCurrency,
}) => {
  return (
    <div className="space-y-10 sm:space-y-16 pb-12">
      {/* Section A: Hero */}
      <Hero
        selectedCurrency={selectedCurrency}
        onCtaClick={() => {
          window.location.href = '/audit';
        }}
        onStatsClick={() => {
          window.location.href = '/stats';
        }}
      />

      {/* WHY I CREATED THIS: Founder Note Feature Card */}
      <section className="px-4 sm:px-6 md:px-12 max-w-5xl mx-auto">
        <div className="bg-[#121316] border-2 border-[#FF3B1E]/70 rounded-3xl p-7 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF3B1E]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#FF3B1E] uppercase tracking-widest mb-4">
            <Terminal className="w-4 h-4" />
            <span>ORIGIN STORY // THE TECHNICAL GUY IN BUSINESS MEETINGS</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-headline text-[#FAF7F2] leading-tight mb-4">
            "I only needed to speak for 90 seconds. <br className="hidden sm:inline" />
            The other 45 minutes were pure calendar burn."
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-[#B8BCC8] leading-relaxed max-w-3xl mb-8">
            <p>
              As a technical engineer, I spent years sitting in syncs where Product Managers, BAs, and business stakeholders talked in circles for an hour. I was told 'engineering presence was required', but 95% of the time I had nothing to contribute except listening for my name.
            </p>
            <p>
              I tried multitasking on another monitor, but deep focus is impossible with voices buzzing in your headset. For the employee, you're mentally drained and robbed of learning. For the employer paying loaded developer rates for engineers to sit as mute spectators, it's thousands burned in payroll.
            </p>
            <p className="font-mono text-xs text-[#FF3B1E]">
              So I built MeetingTax: a calculator that turns invisible calendar inertia into a cold, hard, physical-feeling receipt.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/audit"
              className="px-6 py-3.5 bg-[#FF3B1E] hover:bg-[#E62E12] text-white font-mono font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center space-x-2 cursor-pointer"
            >
              <span>Take the 60-Second Audit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/why"
              className="px-6 py-3.5 bg-[#18191E] hover:bg-[#20222A] text-[#EAECEF] border border-[#2B2E38] font-mono text-xs sm:text-sm tracking-wider rounded-xl transition-colors"
            >
              Read Why I Built This →
            </Link>
          </div>
        </div>
      </section>



      {/* CALL TO ACTION */}
      <section className="px-4 sm:px-6 md:px-12 max-w-4xl mx-auto text-center space-y-6 pt-8">
        <h2 className="text-3xl sm:text-5xl font-black font-headline text-[#FAF7F2]">
          Stop wondering. See your number.
        </h2>
        <p className="text-sm font-mono text-[#888E9E] max-w-md mx-auto">
          No signups. No email gates. 100% client-side privacy.
        </p>
        <div>
          <Link
            to="/audit"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-[#FF3B1E] hover:bg-[#E62E12] text-white font-mono font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl hover:shadow-[#FF3B1E]/25 cursor-pointer"
          >
            <span>Start Calendar Audit Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};
