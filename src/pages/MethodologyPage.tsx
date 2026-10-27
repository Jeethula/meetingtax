import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, BookOpen, ArrowRight } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-[#21232A] pb-8">
        <div className="inline-flex items-center space-x-2 bg-[#17181D] border border-[#333642] px-3.5 py-1.5 rounded-full mb-4">
          <Calculator className="w-3.5 h-3.5 text-[#FF3B1E]" />
          <span className="font-mono text-xs font-semibold tracking-wider text-[#D0D4DD] uppercase">
            Formula Transparency
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-headline text-[#FAF7F2] mb-3">
          Calculation Methodology & Derivations
        </h1>
        <p className="text-sm sm:text-base text-[#888E9E] font-mono">
          Every single number on your 3D receipt is traceable to these exact mathematical definitions.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8 text-sm text-[#C8CCD6] leading-relaxed">
        {/* 1. Employee Math */}
        <div className="bg-[#121316] border border-[#262830] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-mono text-sm uppercase tracking-wider text-[#FF3B1E] font-bold">
            1. Employee Time & Salary Waste Model
          </h2>
          <pre className="bg-[#090A0C] border border-[#21232A] p-4 rounded-xl font-mono text-xs text-[#EAECEF] overflow-x-auto">
            Daily Minutes Lost = MeetingsPerDay × AvgMinutes × (1 − NeededPct)
            Yearly Hours Lost = (Daily Minutes Lost × WorkingDaysPerYear) / 60
            Full Workdays Lost = Yearly Hours Lost / 8
            Hourly Rate (Annual) = AnnualSalary / (WorkingDaysPerYear × 8)
            Salary Waste = Yearly Hours Lost × Hourly Rate
          </pre>
          <p className="text-xs text-[#888E9E]">
            <strong>Working Days Assumption:</strong> Defaults to <strong>230 days per year</strong>. In a 52-week year (260 weekdays), we subtract 20 days of paid vacation/PTO and 10 public holidays.
          </p>
        </div>

        {/* 2. Employer Math */}
        <div className="bg-[#121316] border border-[#262830] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-mono text-sm uppercase tracking-wider text-[#FF3B1E] font-bold">
            2. Employer Meeting Payroll & Spectator Burn
          </h2>
          <pre className="bg-[#090A0C] border border-[#21232A] p-4 rounded-xl font-mono text-xs text-[#EAECEF] overflow-x-auto">
            Hourly Loaded Rate = (AnnualSalary / (WorkingDays × 8)) × LoadedMultiplier
            Cost Per Meeting = Attendees × (Duration + Prep) / 60 × HourlyLoadedRate
            Wasted Cost Per Meeting = (Attendees − Needed) × (Duration + Prep) / 60 × HourlyLoadedRate
            Annualized Waste = Single Meeting Waste × FrequencyMultiplier
          </pre>
          <p className="text-xs text-[#888E9E]">
            <strong>Loaded Cost Multiplier (Default 1.3×):</strong> In professional organizations, an employee's total company cost is 25% to 40% higher than nominal salary. This burden reflects payroll taxes, healthcare, pension/PF, laptops, software seat licenses, and workspace overhead.
          </p>
        </div>

        {/* 3. Compounding Interest */}
        <div className="bg-[#121316] border border-[#262830] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-mono text-sm uppercase tracking-wider text-[#FF3B1E] font-bold">
            3. 10-Year Index Compounding (Future Value)
          </h2>
          <pre className="bg-[#090A0C] border border-[#21232A] p-4 rounded-xl font-mono text-xs text-[#EAECEF] overflow-x-auto">
            Monthly Contribution (P) = Salary Waste / 12
            Future Value (FV) = P × [ ((1 + r/12)^(120) − 1) / (r/12) ]
          </pre>
          <p className="text-xs text-[#888E9E]">
            Calculates the potential wealth generated if wasted meeting salary was invested monthly into a broad market index fund (e.g., Nifty 50 @ 12% CAGR or S&P 500 @ 10% average nominal return).
          </p>
        </div>

        {/* Academic Citations */}
        <div className="bg-[#121316] border border-[#262830] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="font-mono text-sm uppercase tracking-wider text-[#FAF7F2] font-bold flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-[#FF3B1E]" />
            <span>Academic & Empirical Citations</span>
          </h2>
          <ul className="space-y-3 font-mono text-xs text-[#888E9E]">
            <li className="border-l-2 border-[#FF3B1E] pl-3 py-1">
              <strong>Harvard Business Review (2017)</strong>: Leslie A. Perlow, Constance Noonan Hadley, Eunice Eun: <em>"Stop the Meeting Madness"</em>. 71% of senior managers found meetings unproductive.
            </li>
            <li className="border-l-2 border-[#FF3B1E] pl-3 py-1">
              <strong>Microsoft Work Trend Index (2023)</strong>: Telemetry across Microsoft 365 showing meeting hours tripled since 2020 and cited as #1 disruptor to focus.
            </li>
            <li className="border-l-2 border-[#FF3B1E] pl-3 py-1">
              <strong>Bain & Company</strong>: Michael Mankins: <em>"Where Did the Time Go? A Study in Organizational Time"</em>. Found executive meetings consume 23 hrs/week.
            </li>
            <li className="border-l-2 border-[#FF3B1E] pl-3 py-1">
              <strong>Atlassian Workplace Research</strong>: <em>"You Waste A Lot Of Time At Work"</em>. Found ~31 monthly hours spent in unproductive meetings.
            </li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-6 border-t border-[#21232A] flex justify-between items-center">
        <Link to="/" className="text-xs font-mono text-[#888E9E] hover:text-[#EAECEF]">
          ← Back to Home
        </Link>
        <Link
          to="/audit"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-[#FF3B1E] hover:bg-[#E62E12] text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
        >
          <span>Calculate My Tax</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
