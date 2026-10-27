import React, { useState } from 'react';
import type { EmployeeInputs, PayType } from '../lib/calc';
import { CURRENCIES } from '../data/currencies';
import { Sparkles, Minus, Plus, Settings2 } from 'lucide-react';

interface EmployeeFormProps {
  inputs: EmployeeInputs;
  onChange: (inputs: EmployeeInputs) => void;
  onSubmit: () => void;
}

const DURATION_PRESETS = [15, 30, 45, 60, 90];

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  inputs,
  onChange,
  onSubmit,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const curr = CURRENCIES[inputs.currency] || CURRENCIES.INR;

  const updateField = <K extends keyof EmployeeInputs>(field: K, value: EmployeeInputs[K]) => {
    onChange({ ...inputs, [field]: value });
  };

  const handleStepperChange = (delta: number) => {
    const nextVal = Math.max(0, Math.min(16, inputs.meetingsPerDay + delta));
    updateField('meetingsPerDay', nextVal);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="bg-[#121316] border border-[#262830] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8"
    >
      {/* Name / Handle for the receipt */}
      <div>
        <label className="block font-mono text-xs text-[#888E9E] uppercase tracking-wider mb-2">
          Receipt Name or Handle (Optional)
        </label>
        <input
          type="text"
          value={inputs.name || ''}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="@your_handle or Alex"
          maxLength={30}
          className="w-full bg-[#18191E] border border-[#2B2E38] rounded-lg px-4 py-3 font-mono text-sm text-[#F5EFEB] placeholder-[#555866] focus:outline-none focus:border-[#FF3B1E] transition-colors"
        />
      </div>

      {/* Input 1: Meetings Per Day (Slider + Stepper) */}
      <div>
        <div className="flex justify-between items-baseline mb-3">
          <label className="font-mono text-xs sm:text-sm text-[#EAECEF] uppercase tracking-wider font-semibold">
            1. Meetings per workday
          </label>
          <span className="font-mono text-2xl font-black text-[#FF3B1E] tabular-nums">
            {inputs.meetingsPerDay} <span className="text-xs text-[#888E9E] font-normal">syncs/day</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => handleStepperChange(-1)}
            aria-label="Decrease meetings per day"
            className="w-12 h-12 rounded-lg bg-[#18191E] border border-[#2B2E38] text-[#EAECEF] hover:border-[#FF3B1E] flex items-center justify-center font-mono font-bold text-lg active:scale-95 transition-all cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>

          <input
            type="range"
            min={0}
            max={12}
            step={1}
            value={inputs.meetingsPerDay}
            onChange={(e) => updateField('meetingsPerDay', Number(e.target.value))}
            aria-label="Meetings per workday slider"
            className="w-full accent-[#FF3B1E] cursor-pointer h-2 bg-[#262830] rounded-lg"
          />

          <button
            type="button"
            onClick={() => handleStepperChange(1)}
            aria-label="Increase meetings per day"
            className="w-12 h-12 rounded-lg bg-[#18191E] border border-[#2B2E38] text-[#EAECEF] hover:border-[#FF3B1E] flex items-center justify-center font-mono font-bold text-lg active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Input 2: Average Length (Presets + Slider) */}
      <div>
        <div className="flex justify-between items-baseline mb-3">
          <label className="font-mono text-xs sm:text-sm text-[#EAECEF] uppercase tracking-wider font-semibold">
            2. Average meeting duration
          </label>
          <span className="font-mono text-2xl font-black text-[#FF3B1E] tabular-nums">
            {inputs.avgMinutes} <span className="text-xs text-[#888E9E] font-normal">minutes</span>
          </span>
        </div>

        {/* Quick Presets */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {DURATION_PRESETS.map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => updateField('avgMinutes', mins)}
              className={`py-2 rounded font-mono text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                inputs.avgMinutes === mins
                  ? 'bg-[#FF3B1E] border-[#FF3B1E] text-white shadow-md'
                  : 'bg-[#18191E] border-[#2B2E38] text-[#B8BCC8] hover:border-[#4B4F5E]'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>

        <input
          type="range"
          min={10}
          max={120}
          step={5}
          value={inputs.avgMinutes}
          onChange={(e) => updateField('avgMinutes', Number(e.target.value))}
          aria-label="Average meeting duration slider"
          className="w-full accent-[#FF3B1E] cursor-pointer h-2 bg-[#262830] rounded-lg"
        />
      </div>

      {/* Input 3: Honest Slider (Needed vs Wasted) */}
      <div className="bg-[#17181D] border border-[#262830] rounded-xl p-5">
        <div className="flex justify-between items-baseline mb-2">
          <label className="font-mono text-xs sm:text-sm text-[#EAECEF] uppercase tracking-wider font-semibold">
            3. Honest Slider: Did you truly need to be there?
          </label>
          <span className="font-mono text-xl font-bold text-[#FF3B1E] tabular-nums">
            {Math.round(inputs.neededPct * 100)}%
          </span>
        </div>

        <p className="text-xs text-[#888E9E] mb-4">
          Where you actively decided or contributed crucial input — not just idling with video off.
        </p>

        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={inputs.neededPct}
          onChange={(e) => updateField('neededPct', Number(e.target.value))}
          aria-label="Percentage of meetings truly needed slider"
          className="w-full accent-[#FF3B1E] cursor-pointer h-2 bg-[#262830] rounded-lg mb-2"
        />

        <div className="flex justify-between font-mono text-[11px] text-[#888E9E]">
          <span>0% (100% Wasted hostage)</span>
          <span>50% (Half necessary)</span>
          <span>100% (Every minute essential)</span>
        </div>
      </div>

      {/* Input 4: Pay (Optional / Skippable) */}
      <div className="border-t border-[#262830] pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <label className="font-mono text-xs sm:text-sm text-[#EAECEF] uppercase tracking-wider font-semibold">
              4. Compensation (Optional & Private)
            </label>
            <p className="text-xs text-[#888E9E]">
              Translate hours into cold hard salary waste. Skip to see time-only results.
            </p>
          </div>

          {/* Pay Type Toggle */}
          <div className="flex bg-[#18191E] p-1 rounded-lg border border-[#2B2E38]">
            {(['annual', 'monthly', 'hourly', 'none'] as PayType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateField('payType', type)}
                className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer ${
                  inputs.payType === type
                    ? 'bg-[#FF3B1E] text-white'
                    : 'text-[#888E9E] hover:text-[#EAECEF]'
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {inputs.payType !== 'none' && (
          <div className="relative mt-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-[#888E9E]">
              {curr.symbol}
            </span>
            <input
              type="number"
              value={inputs.payAmount || ''}
              onChange={(e) => updateField('payAmount', Math.max(0, Number(e.target.value)))}
              placeholder={`e.g. ${curr.defaultAnnualSalary.toLocaleString()}`}
              className="w-full bg-[#18191E] border border-[#2B2E38] rounded-lg pl-10 pr-4 py-3 font-mono text-base text-[#F5EFEB] placeholder-[#555866] focus:outline-none focus:border-[#FF3B1E] transition-colors"
            />
          </div>
        )}
      </div>

      {/* Advanced Assumptions Accordion */}
      <div className="border-t border-[#262830] pt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-xs font-mono text-[#888E9E] hover:text-[#EAECEF] cursor-pointer"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide working assumptions' : 'Adjust working days assumption (default: 230 days/yr)'}</span>
        </button>

        {showAdvanced && (
          <div className="mt-3 p-4 bg-[#18191E] rounded-lg border border-[#262830] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#888E9E] mb-1">
                Working days per year (52 wks × 5 days - holidays)
              </label>
              <input
                type="number"
                min={100}
                max={320}
                value={inputs.workingDaysPerYear || 230}
                onChange={(e) => updateField('workingDaysPerYear', Number(e.target.value))}
                className="w-full bg-[#121316] border border-[#2B2E38] rounded px-3 py-1.5 font-mono text-xs text-[#F5EFEB]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#888E9E] mb-1">
                Assumed index fund compounding return (%)
              </label>
              <input
                type="number"
                min={2}
                max={25}
                step={0.5}
                value={inputs.assumedIndexReturnPct ?? curr.defaultIndexReturnPct}
                onChange={(e) => updateField('assumedIndexReturnPct', Number(e.target.value))}
                className="w-full bg-[#121316] border border-[#2B2E38] rounded px-3 py-1.5 font-mono text-xs text-[#F5EFEB]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Action */}
      <button
        type="submit"
        className="w-full py-4 bg-[#FF3B1E] hover:bg-[#E62E12] text-white font-mono font-extrabold text-base tracking-wider uppercase rounded-xl shadow-xl hover:shadow-[#FF3B1E]/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99]"
      >
        <Sparkles className="w-5 h-5" />
        <span>Generate my 3D tax receipt</span>
      </button>
    </form>
  );
};
