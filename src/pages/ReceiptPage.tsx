import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { decodeShareParams, encodeShareParams } from '../lib/share';
import {
  calculateEmployeeTax,
  calculateEmployerTax,
  type EmployeeInputs,
  type EmployerInputs,
  type EmployeeResult,
  type EmployerResult,
} from '../lib/calc';
import { getVerdict } from '../lib/verdict';
import { CURRENCIES, DEFAULT_CURRENCY } from '../data/currencies';
import { ReceiptCard3D } from '../components/ReceiptCard3D';
import { ShareBar } from '../components/ShareBar';
import { formatCurrency, formatMinutes } from '../lib/format';
import { calculate10YrIndexCompound } from '../data/opportunities';
import {
  TrendingUp,
  Clock,
  Sliders,
  AlertOctagon,
  ArrowLeft,
  Briefcase,
  Dumbbell,
  GraduationCap,
  Rocket,
  BookOpen,
} from 'lucide-react';

interface ReceiptPageProps {
  selectedCurrency: string;
  onCurrencyChange?: (curr: string) => void;
}

export const ReceiptPage: React.FC<ReceiptPageProps> = ({ selectedCurrency, onCurrencyChange }) => {
  const location = useLocation();

  const [mode, setMode] = useState<'employee' | 'employer'>('employee');
  const [opportunitySeed] = useState(Date.now());
  const [showSlidersDrawer, setShowSlidersDrawer] = useState(true);
  const initialLoaded = useRef(false);

  // Form states initialized from URL query
  const [employeeInputs, setEmployeeInputs] = useState<EmployeeInputs>({
    name: '',
    meetingsPerDay: 5,
    avgMinutes: 30,
    neededPct: 0.40,
    payType: 'none',
    payAmount: undefined,
    currency: selectedCurrency || DEFAULT_CURRENCY,
    workingDaysPerYear: 230,
    opportunitySeed: Date.now(),
  });

  const [employerInputs, setEmployerInputs] = useState<EmployerInputs>({
    companyOrTeam: '',
    attendees: 8,
    needed: 2,
    durationMinutes: 45,
    prepFollowupMinutes: 10,
    frequency: 'weekly',
    annualSalaryPerAttendee: 0,
    loadedMultiplier: 1.3,
    currency: selectedCurrency || DEFAULT_CURRENCY,
    workingDaysPerYear: 230,
  });

  // Decode URL parameters on mount
  useEffect(() => {
    if (initialLoaded.current) return;
    const decoded = decodeShareParams(location.search);
    if (decoded) {
      if (decoded.mode === 'employee' && decoded.employee) {
        setMode('employee');
        const urlCurrency = decoded.employee.currency || selectedCurrency || DEFAULT_CURRENCY;
        setEmployeeInputs((prev) => ({
          ...prev,
          ...decoded.employee,
          currency: urlCurrency,
          meetingsPerDay: decoded.employee?.meetingsPerDay ?? prev.meetingsPerDay,
          avgMinutes: decoded.employee?.avgMinutes ?? prev.avgMinutes,
          neededPct: decoded.employee?.neededPct ?? prev.neededPct,
          payType: decoded.employee?.payType ?? (decoded.employee?.payAmount ? 'annual' : 'none'),
          payAmount: decoded.employee?.payAmount ?? undefined,
        }));
        if (onCurrencyChange && urlCurrency && urlCurrency !== selectedCurrency) {
          onCurrencyChange(urlCurrency);
        }
      } else if (decoded.mode === 'employer' && decoded.employer) {
        setMode('employer');
        const urlCurrency = decoded.employer.currency || selectedCurrency || DEFAULT_CURRENCY;
        setEmployerInputs((prev) => ({
          ...prev,
          ...decoded.employer,
          currency: urlCurrency,
          attendees: decoded.employer?.attendees ?? prev.attendees,
          needed: decoded.employer?.needed ?? prev.needed,
          durationMinutes: decoded.employer?.durationMinutes ?? prev.durationMinutes,
          frequency: decoded.employer?.frequency ?? prev.frequency,
          annualSalaryPerAttendee: decoded.employer?.annualSalaryPerAttendee ?? prev.annualSalaryPerAttendee ?? 0,
        }));
        if (onCurrencyChange && urlCurrency && urlCurrency !== selectedCurrency) {
          onCurrencyChange(urlCurrency);
        }
      }
    }
    initialLoaded.current = true;
  }, [location.search, onCurrencyChange, selectedCurrency]);

  // Reactive listener: when user changes Currency in Navbar dropdown, update card and numbers immediately
  useEffect(() => {
    if (!initialLoaded.current) return;
    if (!selectedCurrency) return;

    const currentCurrency = mode === 'employee' ? employeeInputs.currency : employerInputs.currency;
    if (currentCurrency === selectedCurrency) return;

    const prevConfig = CURRENCIES[currentCurrency] || CURRENCIES.INR;
    const nextConfig = CURRENCIES[selectedCurrency] || CURRENCIES.USD;

    const ratio = prevConfig.defaultAnnualSalary > 0
      ? nextConfig.defaultAnnualSalary / prevConfig.defaultAnnualSalary
      : 1;

    setEmployeeInputs((prev) => {
      const updated: EmployeeInputs = {
        ...prev,
        currency: selectedCurrency,
        payAmount: typeof prev.payAmount === 'number' ? Math.round(prev.payAmount * ratio) : undefined,
      };
      setEmployerInputs((prevEmp) => {
        const updatedEmp: EmployerInputs = {
          ...prevEmp,
          currency: selectedCurrency,
          annualSalaryPerAttendee: Math.round(prevEmp.annualSalaryPerAttendee * ratio),
        };
        const q = encodeShareParams(mode, updated, updatedEmp, false);
        window.history.replaceState(null, '', `?${q}`);
        return updatedEmp;
      });
      return updated;
    });
  }, [selectedCurrency, mode]);

  // Compute results dynamically whenever inputs or opportunitySeed change
  const employeeResult: EmployeeResult | null = useMemo(() => {
    if (mode !== 'employee') return null;
    return calculateEmployeeTax({
      ...employeeInputs,
      opportunitySeed,
    });
  }, [mode, employeeInputs, opportunitySeed]);

  const employerResult: EmployerResult | null = useMemo(() => {
    if (mode !== 'employer') return null;
    return calculateEmployerTax(employerInputs);
  }, [mode, employerInputs]);

  const verdict = useMemo(() => {
    if (mode === 'employee' && employeeResult) {
      return getVerdict('employee', employeeResult.wastePct, employeeResult.hoursWastedPerYear);
    }
    if (mode === 'employer' && employerResult) {
      return getVerdict('employer', employerResult.wasteRatio, employerResult.annualWastedCost);
    }
    return getVerdict('employee', 0.5, 200);
  }, [mode, employeeResult, employerResult]);

  const [returnRate, setReturnRate] = useState(12);

  // Update URL silently as sliders adjust
  const updateUrl = (newEmployee: EmployeeInputs, newEmployer: EmployerInputs) => {
    const q = encodeShareParams(mode, newEmployee, newEmployer, false);
    window.history.replaceState(null, '', `?${q}`);
  };

  const cardOptions = {
    mode,
    employeeData: employeeResult || undefined,
    employerData: employerResult || undefined,
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

  const computedCorpus = employeeResult?.moneyWastedPerYear
    ? calculate10YrIndexCompound(employeeResult.moneyWastedPerYear, returnRate).futureValue
    : null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness':
        return <Dumbbell className="w-3.5 h-3.5 text-[#FF3B1E] flex-shrink-0" />;
      case 'learning':
        return <GraduationCap className="w-3.5 h-3.5 text-[#FF3B1E] flex-shrink-0" />;
      case 'shipping':
        return <Rocket className="w-3.5 h-3.5 text-[#FF3B1E] flex-shrink-0" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-[#FF3B1E] flex-shrink-0" />;
    }
  };

  return (
    <div className="py-4 sm:py-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#21232A] pb-3">
        <Link
          to="/audit"
          className="flex items-center space-x-2 text-xs font-mono text-[#888E9E] hover:text-[#EAECEF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retake Step-by-Step Audit</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowSlidersDrawer(!showSlidersDrawer)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#18191E] border border-[#2B2E38] text-xs font-mono text-[#FF3B1E] hover:bg-[#20222A] cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{showSlidersDrawer ? 'Hide Sliders' : 'Live Adjust Sliders'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left = 3D Card + ShareBar Below, Right = Big Numbers & Live Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: 3D Receipt Card + ShareBar Directly Below Card */}
        <div className="lg:col-span-5 flex flex-col items-center space-y-4">
          <div className="w-full bg-[#121316] border border-[#262830] rounded-2xl p-3 sm:p-4 shadow-2xl relative">
            <div className="text-center mb-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#888E9E]">
                PHYSICAL 3D CARD · STATEMENT (FRONT) / FLIP FOR LEDGER
              </span>
            </div>
            <ReceiptCard3D options={cardOptions} />
          </div>

          {/* Share & Download actions placed below the card itself */}
          <ShareBar
            mode={mode}
            options={cardOptions}
            employeeInputs={employeeInputs}
            employerInputs={employerInputs}
            hoursOrAttendees={hoursOrAttendees}
            workdaysOrCostString={workdaysOrCostString}
          />
        </div>

        {/* Right: Numbers, Dynamic Live Sliders, and 200+ Opportunities */}
        <div className="lg:col-span-7 space-y-4">
          {/* Official Verdict Banner */}
          <div className="bg-[#121316] border-2 border-[#FF3B1E] rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-[#FF3B1E] uppercase tracking-widest mb-1.5">
              <AlertOctagon className="w-4 h-4" />
              <span>OFFICIAL AUDIT VERDICT // {verdict.stampText}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-headline text-[#FAF7F2] leading-tight mb-1.5">
              "{verdict.headline}"
            </h2>
            <p className="text-xs sm:text-sm text-[#888E9E] mb-3">
              {verdict.subhead}
            </p>
            <div className="bg-[#18191E] border border-[#282B36] rounded-xl p-3">
              <span className="block font-mono text-[10px] text-[#FF3B1E] font-bold uppercase mb-0.5">
                RECOMMENDED ALTERNATIVE:
              </span>
              <p className="text-xs sm:text-sm font-mono text-[#F5EFEB]">
                {verdict.suggestedAlternative}
              </p>
            </div>
          </div>

          {/* Big Number Metrics */}
          {mode === 'employee' && employeeResult && (
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
                <div className="font-mono text-xs text-[#888E9E] mb-1">YEARLY LOST</div>
                <div className="font-mono text-3xl font-black text-[#FF3B1E] tabular-nums">
                  {employeeResult.hoursWastedPerYear} <span className="text-base text-[#888E9E]">hrs</span>
                </div>
                <div className="font-mono text-[11px] text-[#636773] mt-1">
                  = {employeeResult.workdaysWastedPerYear} full 8-hr workdays
                </div>
              </div>

              <div className="bg-[#121316] border border-[#262830] rounded-xl p-5">
                <div className="font-mono text-xs text-[#888E9E] mb-1">
                  {employeeResult.moneyWastedPerYear !== null ? 'SALARY SQUANDERED' : 'AUDIT FOCUS'}
                </div>
                <div className="font-mono text-2xl sm:text-3xl font-black text-[#F5EFEB] tabular-nums truncate">
                  {employeeResult.moneyWastedPerYear !== null
                    ? formatCurrency(employeeResult.moneyWastedPerYear, employeeResult.currency)
                    : 'Time-Only'}
                </div>
                <div className="font-mono text-[11px] text-[#636773] mt-1">
                  {employeeResult.moneyWastedPerYear !== null
                    ? 'Direct compensation burnt'
                    : 'No salary entered (Hours audit)'}
                </div>
              </div>
            </div>
          )}

          {mode === 'employer' && employerResult && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#121316] border border-[#262830] rounded-xl p-5">
                <div className="font-mono text-xs text-[#888E9E] mb-1">COST PER SYNC</div>
                <div className="font-mono text-3xl font-black text-[#F5EFEB] tabular-nums truncate">
                  {employerInputs.annualSalaryPerAttendee > 0
                    ? formatCurrency(employerResult.singleMeetingTotalCost, employerResult.currency)
                    : 'Time-Only'}
                </div>
                <div className="font-mono text-[11px] text-[#636773] mt-1">
                  {employerResult.durationMinutes}m · {employerResult.attendees} people
                </div>
              </div>

              <div className="bg-[#121316] border border-[#262830] rounded-xl p-5">
                <div className="font-mono text-xs text-[#888E9E] mb-1">WASTED PER SYNC</div>
                <div className="font-mono text-3xl font-black text-[#FF3B1E] tabular-nums truncate">
                  {employerInputs.annualSalaryPerAttendee > 0
                    ? formatCurrency(employerResult.singleMeetingWastedCost, employerResult.currency)
                    : 'Time-Only'}
                </div>
                <div className="font-mono text-[11px] text-[#636773] mt-1">
                  {employerResult.wastedAttendees} non-essential deciders
                </div>
              </div>

              <div className="bg-[#121316] border border-[#262830] rounded-xl p-5">
                <div className="font-mono text-xs text-[#888E9E] mb-1">ANNUALIZED WASTE</div>
                <div className="font-mono text-2xl sm:text-3xl font-black text-[#FF3B1E] tabular-nums truncate">
                  {employerInputs.annualSalaryPerAttendee > 0
                    ? formatCurrency(employerResult.annualWastedCost, employerResult.currency)
                    : `${employerResult.annualHoursWasted} hrs`}
                </div>
                <div className="font-mono text-[11px] text-[#636773] mt-1">
                  {employerResult.frequency.toUpperCase()} recurring
                </div>
              </div>
            </div>
          )}

          {/* LIVE ADJUSTABLE SLIDERS */}
          {showSlidersDrawer && (
            <div className="bg-[#16171D] border border-[#2A2D37] rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#262830] pb-3">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-[#FF3B1E]" />
                  <span className="font-mono text-xs font-bold uppercase text-[#FAF7F2]">
                    Live Adjustable Parameters (Updates 3D Card Live)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#888E9E]">Real-time React state</span>
              </div>

              {mode === 'employee' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Slider 1: Meetings/day */}
                  <div>
                    <div className="flex justify-between font-mono text-xs text-[#888E9E] mb-1">
                      <span>Meetings / Day</span>
                      <span className="text-[#FF3B1E] font-bold">{employeeInputs.meetingsPerDay}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={12}
                      value={employeeInputs.meetingsPerDay}
                      onChange={(e) => {
                        const updated = { ...employeeInputs, meetingsPerDay: Number(e.target.value) };
                        setEmployeeInputs(updated);
                        updateUrl(updated, employerInputs);
                      }}
                      className="w-full accent-[#FF3B1E] h-1.5 bg-[#262830] rounded cursor-pointer"
                    />
                  </div>

                  {/* Slider 2: Avg minutes */}
                  <div>
                    <div className="flex justify-between font-mono text-xs text-[#888E9E] mb-1">
                      <span>Avg Length</span>
                      <span className="text-[#FF3B1E] font-bold">{employeeInputs.avgMinutes} min</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={90}
                      step={15}
                      value={employeeInputs.avgMinutes}
                      onChange={(e) => {
                        const updated = { ...employeeInputs, avgMinutes: Number(e.target.value) };
                        setEmployeeInputs(updated);
                        updateUrl(updated, employerInputs);
                      }}
                      className="w-full accent-[#FF3B1E] h-1.5 bg-[#262830] rounded cursor-pointer"
                    />
                  </div>

                  {/* Slider 3: Needed % */}
                  <div>
                    <div className="flex justify-between font-mono text-xs text-[#888E9E] mb-1">
                      <span>Truly Needed</span>
                      <span className="text-[#FF3B1E] font-bold">{Math.round(employeeInputs.neededPct * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={employeeInputs.neededPct}
                      onChange={(e) => {
                        const updated = { ...employeeInputs, neededPct: Number(e.target.value) };
                        setEmployeeInputs(updated);
                        updateUrl(updated, employerInputs);
                      }}
                      className="w-full accent-[#FF3B1E] h-1.5 bg-[#262830] rounded cursor-pointer"
                    />
                  </div>

                  {/* Optional Compensation Toggle in Slider Drawer */}
                  <div className="sm:col-span-3 pt-3 border-t border-[#262830] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#888E9E]">Compensation Mode:</span>
                      <span className={employeeInputs.payType !== 'none' && employeeInputs.payAmount ? 'text-emerald-400 font-bold' : 'text-[#888E9E]'}>
                        {employeeInputs.payType !== 'none' && employeeInputs.payAmount
                          ? `${formatCurrency(employeeInputs.payAmount, employeeInputs.currency)} / yr`
                          : 'Time-Only (No salary entered)'}
                      </span>
                    </div>

                    {employeeInputs.payType === 'none' || !employeeInputs.payAmount ? (
                      <button
                        type="button"
                        onClick={() => {
                          const currConfig = CURRENCIES[employeeInputs.currency] || CURRENCIES.INR;
                          const updated: EmployeeInputs = {
                            ...employeeInputs,
                            payType: 'annual',
                            payAmount: currConfig.defaultAnnualSalary,
                          };
                          setEmployeeInputs(updated);
                          updateUrl(updated, employerInputs);
                        }}
                        className="px-2.5 py-1 rounded bg-[#1C1E26] hover:bg-[#252833] text-[#FF3B1E] border border-[#2E313D] transition-colors cursor-pointer"
                      >
                        + Add salary to calculate monetary waste
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const updated: EmployeeInputs = {
                            ...employeeInputs,
                            payType: 'none',
                            payAmount: undefined,
                          };
                          setEmployeeInputs(updated);
                          updateUrl(updated, employerInputs);
                        }}
                        className="px-2.5 py-1 rounded bg-[#1C1E26] hover:bg-[#252833] text-[#888E9E] hover:text-[#FAF7F2] border border-[#2E313D] transition-colors cursor-pointer"
                      >
                        ✕ Clear salary (Switch to Time-Only)
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Slider 1: Attendees */}
                  <div>
                    <div className="flex justify-between font-mono text-xs text-[#888E9E] mb-1">
                      <span>Attendees</span>
                      <span className="text-[#FF3B1E] font-bold">{employerInputs.attendees}</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={40}
                      value={employerInputs.attendees}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const updated = { ...employerInputs, attendees: val, needed: Math.min(employerInputs.needed, val) };
                        setEmployerInputs(updated);
                        updateUrl(employeeInputs, updated);
                      }}
                      className="w-full accent-[#FF3B1E] h-1.5 bg-[#262830] rounded cursor-pointer"
                    />
                  </div>

                  {/* Slider 2: Deciders */}
                  <div>
                    <div className="flex justify-between font-mono text-xs text-[#888E9E] mb-1">
                      <span>Needed Deciders</span>
                      <span className="text-[#FF3B1E] font-bold">{employerInputs.needed}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={employerInputs.attendees}
                      value={employerInputs.needed}
                      onChange={(e) => {
                        const updated = { ...employerInputs, needed: Number(e.target.value) };
                        setEmployerInputs(updated);
                        updateUrl(employeeInputs, updated);
                      }}
                      className="w-full accent-[#FF3B1E] h-1.5 bg-[#262830] rounded cursor-pointer"
                    />
                  </div>

                  {/* Slider 3: Duration */}
                  <div>
                    <div className="flex justify-between font-mono text-xs text-[#888E9E] mb-1">
                      <span>Duration</span>
                      <span className="text-[#FF3B1E] font-bold">{employerInputs.durationMinutes} min</span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={120}
                      step={15}
                      value={employerInputs.durationMinutes}
                      onChange={(e) => {
                        const updated = { ...employerInputs, durationMinutes: Number(e.target.value) };
                        setEmployerInputs(updated);
                        updateUrl(employeeInputs, updated);
                      }}
                      className="w-full accent-[#FF3B1E] h-1.5 bg-[#262830] rounded cursor-pointer"
                    />
                  </div>

                  {/* Explanatory breakdown of 15% needed vs 85% waste */}
                  {employerResult && (
                    <div className="sm:col-span-3 pt-3 border-t border-[#262830] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#888E9E]">
                      <div>
                        <span className="text-[#FAF7F2] font-semibold">{employerResult.needed}</span> core deciders +{' '}
                        <span className="text-[#FAF7F2] font-semibold">{employerResult.otherAttendees}</span> non-core attendees.
                      </div>
                      <div className="text-amber-400/90 text-[11px]">
                        * Non-core attendees counted as 15% active (quick doubts/pings) & 85% idle spectator waste.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 4 DYNAMIC OPPORTUNITY TRANSLATIONS (From 200 items in JSON with Reroll) */}
          {mode === 'employee' && employeeResult && (
            <div className="bg-[#121316] border border-[#262830] rounded-xl p-6 space-y-4">
              <div className="border-b border-[#21232A] pb-3">
                <div className="flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-[#FF3B1E] font-bold">
                  <Clock className="w-4 h-4" />
                  <span>WHAT YOU COULD HAVE DONE IN THOSE {employeeResult.hoursWastedPerYear} HOURS:</span>
                </div>
              </div>

              {/* 4 Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {employeeResult.topOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="bg-[#18191E] border border-[#282B36] rounded-lg p-4 font-mono text-xs text-[#EAECEF] flex items-start space-x-3"
                  >
                    <div className="mt-0.5">{getCategoryIcon(opp.category)}</div>
                    <span className="leading-relaxed">{opp.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Employer Equivalents */}
          {mode === 'employer' && employerResult && (
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
          )}

          {/* 10-Year Index Compounding Card */}
          {employeeResult?.moneyWastedPerYear && computedCorpus && (
            <div className="bg-[#17181D] border border-[#2B2E38] rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
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

              <p className="text-xs text-[#888E9E]">
                If you saved your squandered meeting compensation and invested it monthly into a broad market index fund:
              </p>

              <input
                type="range"
                min={4}
                max={20}
                step={0.5}
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-[#262830] rounded"
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
      </div>
    </div>
  );
};
