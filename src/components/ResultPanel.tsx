import React, { useState } from 'react';
import type { EmployeeResult, EmployerResult, EmployeeInputs, EmployerInputs } from '../lib/calc';
import type { Verdict } from '../lib/verdict';
import { ReceiptCard3D } from './ReceiptCard3D';
import { ShareBar } from './ShareBar';
import { formatCurrency, formatMinutes } from '../lib/format';
import { calculate10YrIndexCompound } from '../data/opportunities';
import {
  TrendingUp,
  Clock,
  Briefcase,
  AlertOctagon,
  HelpCircle,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

interface ResultPanelProps {
  mode: 'employee' | 'employer';
  employeeResult?: EmployeeResult;
  employerResult?: EmployerResult;
  employeeInputs: EmployeeInputs;
  employerInputs: EmployerInputs;
  verdict: Verdict;
  onRecalculate: () => void;
  onOpenMethodology: () => void;
  onOpenAiModal: () => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  mode,
  employeeResult,
  employerResult,
  employeeInputs,
  employerInputs,
  verdict,
  onRecalculate,
  onOpenMethodology,
  onOpenAiModal,
}) => {
  const [returnRate, setReturnRate] = useState(
    employeeResult?.assumedIndexReturnPct ?? 12
  );

  const cardOptions = {
    mode,
    employeeData: employeeResult,
    employerData: employerResult,
    verdict,
    userName: employeeInputs.name,
    companyName: employerInputs.companyOrTeam,
  };

  const hoursOrAttendees = mode === 'employee'
    ? employeeResult?.hoursWastedPerYear || 0
    : employerResult?.attendees || 0;

  const workdaysOrCostString = mode === 'employee'
    ? `${employeeResult?.workdaysWastedPerYear || 0} workdays`
    : employerResult
    ? formatCurrency(employerResult.annualWastedCost, employerResult.currency)
    : '';

  // Dynamic compound calculation with user-editable returnRate
  const computedCorpus = employeeResult?.moneyWastedPerYear
    ? calculate10YrIndexCompound(employeeResult.moneyWastedPerYear, returnRate).futureValue
    : null;

  return (
    <section id="results-panel" className="py-12 sm:py-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-300">
      {/* Top Banner Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#21232A] pb-6">
        <button
          type="button"
          onClick={onRecalculate}
          className="flex items-center space-x-2 text-xs font-mono text-[#888E9E] hover:text-[#EAECEF] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Edit Audit Parameters</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onOpenMethodology}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#18191E] border border-[#2B2E38] text-xs font-mono text-[#888E9E] hover:text-[#EAECEF] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#FF3B1E]" />
            <span>How we calculate this</span>
          </button>

          <button
            type="button"
            onClick={onOpenAiModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#18191E] border border-[#2B2E38] text-xs font-mono text-[#FF3B1E] hover:text-white hover:bg-[#FF3B1E]/20 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Agenda Auditor</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left = 3D Card Hero, Right = Big Numbers & Translations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: The 3D Receipt Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-[#121316] border border-[#262830] rounded-2xl p-4 sm:p-6 shadow-2xl relative">
            <div className="text-center mb-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#888E9E]">
                INTERACTIVE 3D LEDGER CARD
              </span>
            </div>

            <ReceiptCard3D options={cardOptions} />
          </div>
        </div>

        {/* Right Column: Breakdown & Impact */}
        <div className="lg:col-span-7 space-y-6">
          {/* Official Verdict Banner */}
          <div className="bg-[#121316] border-2 border-[#FF3B1E] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF3B1E]/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#FF3B1E] uppercase tracking-widest mb-2">
              <AlertOctagon className="w-4 h-4" />
              <span>OFFICIAL AUDIT VERDICT // {verdict.stampText}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-headline text-[#FAF7F2] leading-tight mb-3">
              "{verdict.headline}"
            </h2>

            <p className="text-sm text-[#B8BCC8] mb-4">
              {verdict.subhead}
            </p>

            <div className="bg-[#18191E] border border-[#282B36] rounded-xl p-4 mt-4">
              <span className="block font-mono text-[11px] text-[#FF3B1E] font-bold uppercase mb-1">
                RECOMMENDED ACTION:
              </span>
              <p className="text-sm font-mono text-[#F5EFEB]">
                {verdict.suggestedAlternative}
              </p>
            </div>
          </div>

          {/* Metric Cards Grid */}
          {mode === 'employee' && employeeResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#121316] border border-[#262830] rounded-xl p-5">
                  <div className="font-mono text-xs text-[#888E9E] mb-1">DAILY TIME WASTED</div>
                  <div className="font-mono text-3xl font-black text-[#F5EFEB] tabular-nums">
                    {formatMinutes(employeeResult.minutesWastedPerDay)}
                  </div>
                  <div className="font-mono text-[11px] text-[#636773] mt-1">
                    {employeeResult.hoursWastedPerWeek} hrs/week
                  </div>
                </div>

                <div className="bg-[#121316] border border-[#262830] rounded-xl p-5">
                  <div className="font-mono text-xs text-[#888E9E] mb-1">YEARLY FLUSHED</div>
                  <div className="font-mono text-3xl font-black text-[#FF3B1E] tabular-nums">
                    {employeeResult.hoursWastedPerYear} <span className="text-base text-[#888E9E]">hrs</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#636773] mt-1">
                    = {employeeResult.workdaysWastedPerYear} full 8-hr workdays
                  </div>
                </div>

                <div className="bg-[#121316] border border-[#262830] rounded-xl p-5">
                  <div className="font-mono text-xs text-[#888E9E] mb-1">SALARY SQUANDERED</div>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-[#F5EFEB] tabular-nums truncate">
                    {employeeResult.moneyWastedPerYear !== null
                      ? formatCurrency(employeeResult.moneyWastedPerYear, employeeResult.currency)
                      : 'Time-Only'}
                  </div>
                  <div className="font-mono text-[11px] text-[#636773] mt-1">
                    {employeeResult.moneyWastedPerYear !== null ? 'Direct compensation burnt' : 'No salary entered'}
                  </div>
                </div>
              </div>

              {/* Opportunity Cost Emotional Hook */}
              <div className="bg-[#121316] border border-[#262830] rounded-xl p-6">
                <div className="font-mono text-xs uppercase tracking-wider text-[#FF3B1E] font-bold mb-3 flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>WHAT YOU COULD HAVE DONE IN THOSE {employeeResult.hoursWastedPerYear} HOURS:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {employeeResult.topOpportunities.map((opp) => (
                    <div
                      key={opp.id}
                      className="bg-[#18191E] border border-[#282B36] rounded-lg p-4 font-mono text-xs text-[#EAECEF] flex items-center"
                    >
                      <span className="text-[#FF3B1E] mr-2">•</span>
                      <span>{opp.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 10-Year Index Compounding Card */}
              {employeeResult.moneyWastedPerYear !== null && computedCorpus !== null && (
                <div className="bg-[#17181D] border border-[#2B2E38] rounded-xl p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="font-mono text-xs uppercase font-bold text-[#EAECEF]">
                        10-Year Index Fund Compound Potential
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] font-mono text-[#888E9E]">
                      <span>Assumed Return:</span>
                      <span className="text-emerald-400 font-bold">{returnRate}%</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#888E9E] mb-3">
                    If you invested your wasted meeting pay monthly in a broad market index (illustrative):
                  </p>

                  <input
                    type="range"
                    min={4}
                    max={20}
                    step={0.5}
                    value={returnRate}
                    onChange={(e) => setReturnRate(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-[#262830] rounded mb-4"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-t border-[#262830] pt-4">
                    <div>
                      <div className="font-mono text-[11px] text-[#888E9E]">PROJECTED 10-YEAR CORPUS:</div>
                      <div className="font-mono text-3xl font-black text-emerald-400 tabular-nums">
                        {formatCurrency(computedCorpus, employeeResult.currency)}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-[#888E9E] sm:text-right">
                      Future value of monthly contributions
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Employer Mode Metrics */}
          {mode === 'employer' && employerResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#121316] border border-[#262830] rounded-xl p-5">
                  <div className="font-mono text-xs text-[#888E9E] mb-1">COST PER SYNC</div>
                  <div className="font-mono text-3xl font-black text-[#F5EFEB] tabular-nums truncate">
                    {formatCurrency(employerResult.singleMeetingTotalCost, employerResult.currency)}
                  </div>
                  <div className="font-mono text-[11px] text-[#636773] mt-1">
                    {employerResult.durationMinutes}m duration · {employerResult.attendees} attendees
                  </div>
                </div>

                <div className="bg-[#121316] border border-[#262830] rounded-xl p-5">
                  <div className="font-mono text-xs text-[#888E9E] mb-1">WASTED PER SYNC</div>
                  <div className="font-mono text-3xl font-black text-[#FF3B1E] tabular-nums truncate">
                    {formatCurrency(employerResult.singleMeetingWastedCost, employerResult.currency)}
                  </div>
                  <div className="font-mono text-[11px] text-[#636773] mt-1">
                    {employerResult.wastedAttendees} non-essential people
                  </div>
                </div>

                <div className="bg-[#121316] border border-[#262830] rounded-xl p-5">
                  <div className="font-mono text-xs text-[#888E9E] mb-1">ANNUALIZED WASTE</div>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-[#FF3B1E] tabular-nums truncate">
                    {formatCurrency(employerResult.annualWastedCost, employerResult.currency)}
                  </div>
                  <div className="font-mono text-[11px] text-[#636773] mt-1">
                    {employerResult.frequency.toUpperCase()} recurrence
                  </div>
                </div>
              </div>

              {/* Employer Equivalents */}
              <div className="bg-[#121316] border border-[#262830] rounded-xl p-6">
                <div className="font-mono text-xs uppercase tracking-wider text-[#FF3B1E] font-bold mb-3 flex items-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>WHAT THAT ANNUAL WASTE EQUALS:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {employerResult.equivalents.map((eq) => (
                    <div
                      key={eq.id}
                      className="bg-[#18191E] border border-[#282B36] rounded-lg p-4 font-mono text-xs text-[#EAECEF] flex items-center"
                    >
                      <span className="text-[#FF3B1E] mr-2">•</span>
                      <span>{eq.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Share + Tools Bar */}
          <ShareBar
            mode={mode}
            options={cardOptions}
            employeeInputs={employeeInputs}
            employerInputs={employerInputs}
            hoursOrAttendees={hoursOrAttendees}
            workdaysOrCostString={workdaysOrCostString}
          />
        </div>
      </div>
    </section>
  );
};
