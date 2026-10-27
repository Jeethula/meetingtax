import React from 'react';
import { Link } from 'react-router-dom';
import { PainScroll } from '../components/PainScroll';
import { ArrowRight, BookOpen } from 'lucide-react';

interface StatsPageProps {
  selectedCurrency: string;
}

export const StatsPage: React.FC<StatsPageProps> = ({ selectedCurrency }) => {
  return (
    <div className="space-y-12 pb-24">
      {/* Page Header */}
      <div className="pt-12 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-b border-[#21232A] pb-8">
        <div className="inline-flex items-center space-x-2 bg-[#17181D] border border-[#333642] px-3.5 py-1.5 rounded-full mb-4">
          <BookOpen className="w-3.5 h-3.5 text-[#FF3B1E]" />
          <span className="font-mono text-xs font-semibold tracking-wider text-[#D0D4DD] uppercase">
            Empirical Telemetry & Research Database
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-headline text-[#FAF7F2] mb-3">
          The Cold Hard Science of Meeting Waste.
        </h1>
        <p className="text-sm sm:text-base text-[#888E9E] max-w-2xl font-mono">
          Peer-reviewed studies and telemetry across billions of workplace signals showing the measurable cost of calendar sprawl.
        </p>
      </div>

      {/* PainScroll Component */}
      <PainScroll selectedCurrency={selectedCurrency} />

      {/* Footer CTA */}
      <div className="px-4 sm:px-6 md:px-12 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold font-headline text-[#FAF7F2]">
          Now tally what this costs you personally.
        </h2>
        <Link
          to="/audit"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-[#FF3B1E] hover:bg-[#E62E12] text-white font-mono font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl hover:shadow-[#FF3B1E]/20"
        >
          <span>Calculate Your Own Meeting Tax</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
