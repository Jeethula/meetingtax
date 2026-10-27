import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CURRENCIES } from '../data/currencies';
import { ROLE_PRESETS } from '../data/rolePresets';
import { encodeShareParams } from '../lib/share';
import { track } from '../lib/analytics';
import {
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
  Minus,
  Plus,
  Sparkles,
} from 'lucide-react';
import type { EmployeeInputs, EmployerInputs, PayType, MeetingFrequency } from '../lib/calc';

interface AuditPageProps {
  selectedCurrency: string;
  onCurrencyChange?: (curr: string) => void;
}

export const AuditPage: React.FC<AuditPageProps> = ({ selectedCurrency }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState<'employee' | 'employer'>('employee');

  const curr = CURRENCIES[selectedCurrency] || CURRENCIES.INR;

  const [employeeInputs, setEmployeeInputs] = useState<EmployeeInputs>({
    name: '',
    meetingsPerDay: 5,
    avgMinutes: 30,
    neededPct: 0.40,
    payType: 'none',
    payAmount: undefined,
    currency: selectedCurrency,
    workingDaysPerYear: 230,
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
    currency: selectedCurrency,
    workingDaysPerYear: 230,
  });

  // Keep inputs currency synced with Navbar currency picker without forcing a fake salary
  React.useEffect(() => {
    setEmployeeInputs((prev) => ({
      ...prev,
      currency: selectedCurrency,
    }));
    setEmployerInputs((prev) => ({
      ...prev,
      currency: selectedCurrency,
    }));
  }, [selectedCurrency]);

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Final submit: Navigate to /receipt with encoded URL parameters (persisting salary if entered)
      track('card_generated', { mode });
      const query = encodeShareParams(mode, employeeInputs, employerInputs, true);
      navigate(`/receipt?${query}`);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 max-w-2xl mx-auto space-y-5">
      {/* Progress Bar Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono text-xs text-[#888E9E]">
          <span className="text-[#FF3B1E] font-bold">
            AUDIT QUESTIONNAIRE // STEP {currentStep} OF {totalSteps}
          </span>
          <span>{Math.round((currentStep / totalSteps) * 100)}% COMPLETE</span>
        </div>
        <div className="w-full bg-[#1A1C22] h-1.5 rounded-full overflow-hidden border border-[#2B2E38]">
          <div
            className="bg-[#FF3B1E] h-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card Container */}
      <div className="bg-[#121316] border border-[#262830] rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6">
        {/* STEP 1: Who are you? */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <span className="font-mono text-xs text-[#FF3B1E] uppercase tracking-wider font-bold">
                Question 1
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-headline text-[#FAF7F2] mt-1">
                Who is filing this calendar audit?
              </h2>
              <p className="text-sm text-[#888E9E] mt-1">
                Choose your perspective to calibrate the waste ledger.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode('employee')}
                className={`p-6 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === 'employee'
                    ? 'bg-[#18191E] border-[#FF3B1E] ring-1 ring-[#FF3B1E]'
                    : 'bg-[#15171C] border-[#252830] hover:border-[#383C48]'
                }`}
              >
                <User className="w-6 h-6 text-[#FF3B1E] mb-3" />
                <h3 className="font-headline text-lg font-bold text-[#F5EFEB] mb-1">
                  I'm an Employee / Builder
                </h3>
                <p className="text-xs text-[#888E9E] leading-relaxed">
                  Track how much of your personal life, focus blocks, and compensation are burned in meetings.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('employer')}
                className={`p-6 rounded-xl border text-left transition-all cursor-pointer ${
                  mode === 'employer'
                    ? 'bg-[#18191E] border-[#FF3B1E] ring-1 ring-[#FF3B1E]'
                    : 'bg-[#15171C] border-[#252830] hover:border-[#383C48]'
                }`}
              >
                <Building2 className="w-6 h-6 text-[#FF3B1E] mb-3" />
                <h3 className="font-headline text-lg font-bold text-[#F5EFEB] mb-1">
                  I'm a Leader / Employer
                </h3>
                <p className="text-xs text-[#888E9E] leading-relaxed">
                  Calculate what recurring team syncs are draining in loaded company payroll and passive spectator hours.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Meeting Volume / Attendees */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <span className="font-mono text-xs text-[#FF3B1E] uppercase tracking-wider font-bold">
                Question 2
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-headline text-[#FAF7F2] mt-1">
                {mode === 'employee'
                  ? 'How many meetings do you attend on an average workday?'
                  : 'How many total attendees sit in on this meeting?'}
              </h2>
              <p className="text-sm text-[#888E9E] mt-1">
                {mode === 'employee'
                  ? 'Count standups, 1-on-1s, syncs, reviews, and ad-hoc huddles.'
                  : 'Include all participants on the invite list.'}
              </p>
            </div>

            {mode === 'employee' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-xs text-[#888E9E] uppercase">Daily Meeting Count:</span>
                  <span className="font-mono text-4xl font-black text-[#FF3B1E]">
                    {employeeInputs.meetingsPerDay} <span className="text-base text-[#888E9E]">meetings/day</span>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setEmployeeInputs({ ...employeeInputs, meetingsPerDay: Math.max(0, employeeInputs.meetingsPerDay - 1) })}
                    className="w-12 h-12 rounded-lg bg-[#18191E] border border-[#2B2E38] text-[#EAECEF] hover:border-[#FF3B1E] flex items-center justify-center font-mono font-bold text-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={12}
                    value={employeeInputs.meetingsPerDay}
                    onChange={(e) => setEmployeeInputs({ ...employeeInputs, meetingsPerDay: Number(e.target.value) })}
                    className="w-full accent-[#FF3B1E] cursor-pointer h-2 bg-[#262830] rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setEmployeeInputs({ ...employeeInputs, meetingsPerDay: Math.min(16, employeeInputs.meetingsPerDay + 1) })}
                    className="w-12 h-12 rounded-lg bg-[#18191E] border border-[#2B2E38] text-[#EAECEF] hover:border-[#FF3B1E] flex items-center justify-center font-mono font-bold text-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-xs text-[#888E9E] uppercase">Attendee Count:</span>
                  <span className="font-mono text-4xl font-black text-[#FF3B1E]">
                    {employerInputs.attendees} <span className="text-base text-[#888E9E]">people</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={employerInputs.attendees}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setEmployerInputs({
                      ...employerInputs,
                      attendees: val,
                      needed: Math.min(employerInputs.needed, val),
                    });
                  }}
                  className="w-full accent-[#FF3B1E] cursor-pointer h-2 bg-[#262830] rounded-lg"
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Duration & Frequency */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <span className="font-mono text-xs text-[#FF3B1E] uppercase tracking-wider font-bold">
                Question 3
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-headline text-[#FAF7F2] mt-1">
                What is the average duration?
              </h2>
              <p className="text-sm text-[#888E9E] mt-1">
                Typical scheduled calendar block.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="font-mono text-xs text-[#888E9E] uppercase">Duration in minutes:</span>
                <span className="font-mono text-4xl font-black text-[#FF3B1E]">
                  {mode === 'employee' ? employeeInputs.avgMinutes : employerInputs.durationMinutes} <span className="text-base text-[#888E9E]">min</span>
                </span>
              </div>

              {/* Presets */}
              <div className="grid grid-cols-5 gap-2">
                {[15, 30, 45, 60, 90].map((mins) => {
                  const currentMins = mode === 'employee' ? employeeInputs.avgMinutes : employerInputs.durationMinutes;
                  return (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        if (mode === 'employee') setEmployeeInputs({ ...employeeInputs, avgMinutes: mins });
                        else setEmployerInputs({ ...employerInputs, durationMinutes: mins });
                      }}
                      className={`py-2 rounded font-mono text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                        currentMins === mins
                          ? 'bg-[#FF3B1E] border-[#FF3B1E] text-white shadow'
                          : 'bg-[#18191E] border-[#2B2E38] text-[#B8BCC8] hover:border-[#4B4F5E]'
                      }`}
                    >
                      {mins}m
                    </button>
                  );
                })}
              </div>

              {mode === 'employer' && (
                <div className="pt-4 border-t border-[#262830]">
                  <label className="block font-mono text-xs text-[#888E9E] uppercase mb-2">
                    How often does this meeting recur?
                  </label>
                  <select
                    value={employerInputs.frequency}
                    onChange={(e) => setEmployerInputs({ ...employerInputs, frequency: e.target.value as MeetingFrequency })}
                    className="w-full bg-[#18191E] border border-[#2B2E38] rounded-lg px-3 py-2.5 font-mono text-sm text-[#F5EFEB] focus:outline-none focus:border-[#FF3B1E]"
                  >
                    <option value="weekly">Weekly (48x per year)</option>
                    <option value="daily">Daily (230x per year)</option>
                    <option value="biweekly">Bi-Weekly (24x per year)</option>
                    <option value="monthly">Monthly (12x per year)</option>
                    <option value="one-off">One-Off (1x only)</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Honest Slider */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <span className="font-mono text-xs text-[#FF3B1E] uppercase tracking-wider font-bold">
                Question 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-headline text-[#FAF7F2] mt-1">
                {mode === 'employee'
                  ? 'The Honest Question: How many actually needed you there?'
                  : 'How many people actually needed to attend to make the decision?'}
              </h2>
              <p className="text-sm text-[#888E9E] mt-1">
                {mode === 'employee'
                  ? 'Be honest: meetings where you made active decisions or provided critical input — not just idling as a mute audience member.'
                  : 'Usually 2 people make the call. The rest are spectators who could read a 3-bullet async summary.'}
              </p>
            </div>

            {mode === 'employee' ? (
              <div className="space-y-4 bg-[#18191E] border border-[#262830] rounded-xl p-6">
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-xs text-[#888E9E] uppercase">Truly Essential Attendance:</span>
                  <span className="font-mono text-3xl font-black text-[#FF3B1E]">
                    {Math.round(employeeInputs.neededPct * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={employeeInputs.neededPct}
                  onChange={(e) => setEmployeeInputs({ ...employeeInputs, neededPct: Number(e.target.value) })}
                  className="w-full accent-[#FF3B1E] cursor-pointer h-2 bg-[#262830] rounded-lg"
                />
                <div className="flex justify-between font-mono text-[11px] text-[#888E9E]">
                  <span>0% (100% Wasted hostage)</span>
                  <span>50% (Half needed)</span>
                  <span>100% (Every minute crucial)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 bg-[#18191E] border border-[#262830] rounded-xl p-6">
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-xs text-[#888E9E] uppercase">Crucial Deciders:</span>
                  <span className="font-mono text-3xl font-black text-[#FF3B1E]">
                    {employerInputs.needed} of {employerInputs.attendees} people
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={employerInputs.attendees}
                  value={employerInputs.needed}
                  onChange={(e) => setEmployerInputs({ ...employerInputs, needed: Number(e.target.value) })}
                  className="w-full accent-[#FF3B1E] cursor-pointer h-2 bg-[#262830] rounded-lg"
                />
                <div className="flex justify-between font-mono text-[11px] text-[#888E9E]">
                  <span>0 deciders</span>
                  <span>{Math.max(1, Math.floor(employerInputs.attendees / 2))} deciders</span>
                  <span>All {employerInputs.attendees} needed</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Compensation & Identity */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <span className="font-mono text-xs text-[#FF3B1E] uppercase tracking-wider font-bold">
                Question 5
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-headline text-[#FAF7F2] mt-1">
                Receipt Name & Compensation (Optional)
              </h2>
              <p className="text-sm text-[#888E9E] mt-1">
                Translate time into cold, hard wasted salary. Everything is 100% private in your browser.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-[#888E9E] uppercase mb-1">
                  {mode === 'employee' ? 'Name or Handle (Optional):' : 'Meeting Title or Team (Optional):'}
                </label>
                <input
                  type="text"
                  value={mode === 'employee' ? (employeeInputs.name || '') : (employerInputs.companyOrTeam || '')}
                  onChange={(e) => {
                    if (mode === 'employee') setEmployeeInputs({ ...employeeInputs, name: e.target.value });
                    else setEmployerInputs({ ...employerInputs, companyOrTeam: e.target.value });
                  }}
                  placeholder={mode === 'employee' ? '@username or Alex' : 'e.g. Weekly All-Hands'}
                  className="w-full bg-[#18191E] border border-[#2B2E38] rounded-lg px-4 py-3 font-mono text-sm text-[#F5EFEB] focus:outline-none focus:border-[#FF3B1E]"
                />
              </div>

              {mode === 'employee' ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-mono text-xs text-[#888E9E] uppercase">
                      Salary / Rate ({curr.code}) — Optional:
                    </label>
                    <div className="flex space-x-1 bg-[#18191E] p-1 rounded border border-[#2B2E38]">
                      {(['none', 'annual', 'monthly', 'hourly'] as PayType[]).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => {
                            setEmployeeInputs({
                              ...employeeInputs,
                              payType: t,
                              payAmount: t === 'none' ? undefined : employeeInputs.payAmount,
                            });
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                            employeeInputs.payType === t
                              ? 'bg-[#FF3B1E] text-white font-bold'
                              : 'text-[#888E9E] hover:text-[#FAF7F2]'
                          }`}
                        >
                          {t === 'none' ? 'TIME-ONLY' : t.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {employeeInputs.payType === 'none' ? (
                    <div className="bg-[#18191E] border border-[#2B2E38] rounded-lg p-4 text-xs font-mono text-[#888E9E]">
                      <span className="text-[#FAF7F2] font-semibold block mb-0.5">
                        ⏱ Time-Only Mode (No salary entered)
                      </span>
                      <span>
                        No salary will be calculated or displayed. Your receipt will strictly audit wasted hours and workdays.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-[#888E9E]">
                          {curr.symbol}
                        </span>
                        <input
                          type="number"
                          placeholder={`Enter amount, e.g. ${curr.defaultAnnualSalary.toLocaleString()}`}
                          value={employeeInputs.payAmount !== undefined ? employeeInputs.payAmount : ''}
                          onChange={(e) => {
                            const val = e.target.value.trim();
                            setEmployeeInputs({
                              ...employeeInputs,
                              payAmount: val === '' ? undefined : Math.max(0, Number(val)),
                            });
                          }}
                          className="w-full bg-[#18191E] border border-[#2B2E38] rounded-lg pl-10 pr-4 py-3 font-mono text-base text-[#F5EFEB] focus:outline-none focus:border-[#FF3B1E]"
                        />
                      </div>
                      <span className="text-[11px] font-mono text-[#636773] block">
                        Leave blank or select TIME-ONLY if you prefer not to calculate monetary value.
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block font-mono text-xs text-[#888E9E] uppercase mb-2">
                    Role Preset or Annual Attendee Salary:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                    {ROLE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          const sal = preset.annualSalary[selectedCurrency] || curr.defaultAnnualSalary;
                          setEmployerInputs({ ...employerInputs, annualSalaryPerAttendee: sal });
                        }}
                        className="py-1 px-2 bg-[#18191E] border border-[#2B2E38] hover:border-[#FF3B1E] text-[#B8BCC8] rounded text-xs font-mono truncate"
                      >
                        {preset.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-[#888E9E]">
                      {curr.symbol}
                    </span>
                    <input
                      type="number"
                      value={employerInputs.annualSalaryPerAttendee}
                      onChange={(e) => setEmployerInputs({ ...employerInputs, annualSalaryPerAttendee: Math.max(0, Number(e.target.value)) })}
                      className="w-full bg-[#18191E] border border-[#2B2E38] rounded-lg pl-10 pr-4 py-3 font-mono text-base text-[#F5EFEB] focus:outline-none focus:border-[#FF3B1E]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="flex items-center justify-between border-t border-[#21232A] pt-6">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={handlePrev}
            className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#18191E] border border-[#2B2E38] font-mono text-xs text-[#888E9E] hover:text-[#EAECEF] disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center space-x-2 px-7 py-3 rounded-xl bg-[#FF3B1E] hover:bg-[#E62E12] text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer"
          >
            <span>{currentStep === totalSteps ? 'Generate 3D Receipt' : 'Next Step'}</span>
            {currentStep === totalSteps ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
