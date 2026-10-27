import { X, BookOpen, Calculator } from 'lucide-react';


interface MethodologyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MethodologyDrawer: React.FC<MethodologyDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#121316] border border-[#2B2E38] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="methodology-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#21232A] pb-4">
          <div className="flex items-center space-x-2.5">
            <Calculator className="w-5 h-5 text-[#FF3B1E]" />
            <h2 id="methodology-title" className="font-headline text-xl font-bold text-[#F5EFEB]">
              Audit Methodology & Formulas
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18191E] hover:bg-[#22242C] text-[#888E9E] hover:text-[#EAECEF] transition-colors cursor-pointer"
            aria-label="Close methodology modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 text-sm text-[#B8BCC8] leading-relaxed">
          {/* Employee math */}
          <div className="bg-[#18191E] border border-[#262830] rounded-xl p-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#FF3B1E] font-bold mb-2">
              1. Employee Waste Computation
            </h3>
            <pre className="bg-[#0D0E11] p-3 rounded font-mono text-xs text-[#EAECEF] overflow-x-auto mb-2">
              Minutes Lost / Day = Meetings × AvgDuration × (1 − Needed%)
              Hours Lost / Year = (Minutes Lost / Day × WorkingDays) / 60
              Full Workdays Lost = Hours Lost / 8
              Salary Lost = Hours Lost × (AnnualPay / (WorkingDays × 8))
            </pre>
            <p className="text-xs text-[#888E9E]">
              Working days defaults to <strong>230 days</strong> (52 weeks × 5 days = 260, minus 20 days vacation/PTO and 10 public holidays).
            </p>
          </div>

          {/* Employer math */}
          <div className="bg-[#18191E] border border-[#262830] rounded-xl p-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#FF3B1E] font-bold mb-2">
              2. Employer & Team Meeting Cost
            </h3>
            <pre className="bg-[#0D0E11] p-3 rounded font-mono text-xs text-[#EAECEF] overflow-x-auto mb-2">
              Hourly Loaded Rate = (AnnualSalary / (WorkingDays × 8)) × LoadedMultiplier
              Cost / Meeting = Attendees × (Duration + Prep) / 60 × HourlyLoadedRate
              Wasted Cost / Meeting = (Attendees − Needed) × (Duration + Prep) / 60 × HourlyLoadedRate
              Annual Waste = Single Meeting Waste × FrequencyMultiplier
            </pre>
            <p className="text-xs text-[#888E9E]">
              The <strong>Loaded Multiplier (default 1.3×)</strong> reflects mandatory overhead: employer payroll taxes, healthcare, pension/provident fund, software seat licenses, and laptop provisioning.
            </p>
          </div>

          {/* Compound Index Returns */}
          <div className="bg-[#18191E] border border-[#262830] rounded-xl p-4">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#FF3B1E] font-bold mb-2">
              3. 10-Year Index Compounding Model (Future Value)
            </h3>
            <pre className="bg-[#0D0E11] p-3 rounded font-mono text-xs text-[#EAECEF] overflow-x-auto mb-2">
              FV = MonthlyContribution × [ ((1 + r/12)^(120) − 1) / (r/12) ]
            </pre>
            <p className="text-xs text-[#888E9E]">
              Assumes wasted salary value is saved each month and invested in a diversified broad-market index fund (e.g. Nifty 50 @ 12% CAGR or S&P 500 @ 10% nominal return). Labelled purely illustrative.
            </p>
          </div>

          {/* Academic Citations */}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#FAF7F2] font-bold mb-3 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[#FF3B1E]" />
              <span>Academic & Industry Sources</span>
            </h3>
            <ul className="space-y-2 text-xs font-mono text-[#888E9E]">
              <li className="flex items-baseline space-x-1.5">
                <span className="text-[#FF3B1E]">•</span>
                <span>Harvard Business Review (2017) — Leslie A. Perlow, Constance Noonan Hadley, Eunice Eun: "Stop the Meeting Madness".</span>
              </li>
              <li className="flex items-baseline space-x-1.5">
                <span className="text-[#FF3B1E]">•</span>
                <span>Microsoft Work Trend Index (2023) — "Will AI Fix Work?" Telemetry analysis across Microsoft 365.</span>
              </li>
              <li className="flex items-baseline space-x-1.5">
                <span className="text-[#FF3B1E]">•</span>
                <span>Bain & Company — Michael Mankins: "Where Did the Time Go? A Study in Organizational Time".</span>
              </li>
              <li className="flex items-baseline space-x-1.5">
                <span className="text-[#FF3B1E]">•</span>
                <span>Atlassian Workplace Research — "You Waste A Lot Of Time At Work".</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#21232A] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#18191E] hover:bg-[#20222A] text-[#F5EFEB] font-mono text-xs font-bold rounded-lg border border-[#2B2E38] transition-colors cursor-pointer"
          >
            Close Methodology
          </button>
        </div>
      </div>
    </div>
  );
};
