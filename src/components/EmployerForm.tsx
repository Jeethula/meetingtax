import React, { useState } from 'react';
import type { EmployerInputs, MeetingFrequency } from '../lib/calc';
import { ROLE_PRESETS } from '../data/rolePresets';
import { CURRENCIES } from '../data/currencies';
import { Minus, Plus, Settings2, Sparkles } from 'lucide-react';

interface EmployerFormProps {
  inputs: EmployerInputs;
  onChange: (inputs: EmployerInputs) => void;
  onSubmit: () => void;
}

const FREQUENCY_OPTIONS: { id: MeetingFrequency; label: string }[] = [
  { id: 'weekly', label: 'Weekly (48x/yr)' },
  { id: 'daily', label: 'Daily (230x/yr)' },
  { id: 'biweekly', label: 'Bi-Weekly (24x/yr)' },
  { id: 'monthly', label: 'Monthly (12x/yr)' },
  { id: 'one-off', label: 'One-Off (1x)' },
];

export const EmployerForm: React.FC<EmployerFormProps> = ({
  inputs,
  onChange,
  onSubmit,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const curr = CURRENCIES[inputs.currency] || CURRENCIES.INR;

  const updateField = <K extends keyof EmployerInputs>(field: K, value: EmployerInputs[K]) => {
    onChange({ ...inputs, [field]: value });
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = ROLE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const salary = preset.annualSalary[inputs.currency] || preset.annualSalary.INR || 1800000;
    onChange({
      ...inputs,
      annualSalaryPerAttendee: salary,
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="bg-[#121316] border border-[#262830] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8"
    >
      {/* Meeting or Org Title */}
      <div>
        <label className="block font-mono text-xs text-[#888E9E] uppercase tracking-wider mb-2">
          Meeting Title or Team (Optional)
        </label>
        <div className="relative">
          <input
            type="text"
            value={inputs.companyOrTeam || ''}
            onChange={(e) => updateField('companyOrTeam', e.target.value)}
            placeholder="e.g. Weekly All-Hands / Sprint Planning / Eng Sync"
            maxLength={40}
            className="w-full bg-[#18191E] border border-[#2B2E38] rounded-lg px-4 py-3 font-mono text-sm text-[#F5EFEB] placeholder-[#555866] focus:outline-none focus:border-[#FF3B1E] transition-colors"
          />
        </div>
      </div>

      {/* Input 1: Attendees and Essential Needed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#17181D] border border-[#262830] rounded-xl p-5">
        {/* Total Attendees */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="font-mono text-xs text-[#EAECEF] uppercase tracking-wider font-semibold">
              Total Attendees
            </label>
            <span className="font-mono text-xl font-bold text-[#FAF7F2] tabular-nums">
              {inputs.attendees} <span className="text-xs text-[#888E9E] font-normal">people</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => updateField('attendees', Math.max(1, inputs.attendees - 1))}
              className="w-10 h-10 rounded bg-[#121316] border border-[#2B2E38] text-[#EAECEF] flex items-center justify-center font-mono cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min={1}
              max={50}
              value={inputs.attendees}
              onChange={(e) => {
                const val = Number(e.target.value);
                updateField('attendees', val);
                if (inputs.needed > val) updateField('needed', val);
              }}
              className="w-full accent-[#FF3B1E] cursor-pointer h-2 bg-[#262830] rounded"
            />
            <button
              type="button"
              onClick={() => updateField('attendees', Math.min(100, inputs.attendees + 1))}
              className="w-10 h-10 rounded bg-[#121316] border border-[#2B2E38] text-[#EAECEF] flex items-center justify-center font-mono cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Needed Attendees */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="font-mono text-xs text-[#EAECEF] uppercase tracking-wider font-semibold">
              Actually Needed
            </label>
            <span className="font-mono text-xl font-bold text-[#FF3B1E] tabular-nums">
              {inputs.needed} <span className="text-xs text-[#888E9E] font-normal">deciders</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => updateField('needed', Math.max(0, inputs.needed - 1))}
              className="w-10 h-10 rounded bg-[#121316] border border-[#2B2E38] text-[#EAECEF] flex items-center justify-center font-mono cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min={0}
              max={inputs.attendees}
              value={inputs.needed}
              onChange={(e) => updateField('needed', Number(e.target.value))}
              className="w-full accent-[#FF3B1E] cursor-pointer h-2 bg-[#262830] rounded"
            />
            <button
              type="button"
              onClick={() => updateField('needed', Math.min(inputs.attendees, inputs.needed + 1))}
              className="w-10 h-10 rounded bg-[#121316] border border-[#2B2E38] text-[#EAECEF] flex items-center justify-center font-mono cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Input 2: Role Preset & Benchmark Salary */}
      <div>
        <label className="block font-mono text-xs text-[#888E9E] uppercase tracking-wider mb-2">
          Average Attendee Role or Salary
        </label>
        {/* Preset chips */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
          {ROLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetSelect(preset.id)}
              className="py-1.5 px-2 bg-[#18191E] border border-[#2B2E38] hover:border-[#FF3B1E] text-[#B8BCC8] rounded text-xs font-mono font-medium transition-colors cursor-pointer text-center truncate"
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
            value={inputs.annualSalaryPerAttendee || ''}
            onChange={(e) => updateField('annualSalaryPerAttendee', Math.max(0, Number(e.target.value)))}
            placeholder="Annual salary per attendee"
            className="w-full bg-[#18191E] border border-[#2B2E38] rounded-lg pl-10 pr-4 py-3 font-mono text-base text-[#F5EFEB] focus:outline-none focus:border-[#FF3B1E] transition-colors"
          />
        </div>
      </div>

      {/* Input 3: Duration & Frequency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label className="font-mono text-xs text-[#EAECEF] uppercase tracking-wider font-semibold">
              Meeting Duration
            </label>
            <span className="font-mono text-lg font-bold text-[#FAF7F2] tabular-nums">
              {inputs.durationMinutes} min
            </span>
          </div>
          <input
            type="range"
            min={15}
            max={180}
            step={15}
            value={inputs.durationMinutes}
            onChange={(e) => updateField('durationMinutes', Number(e.target.value))}
            className="w-full accent-[#FF3B1E] cursor-pointer h-2 bg-[#262830] rounded"
          />
        </div>

        <div>
          <label className="block font-mono text-xs text-[#EAECEF] uppercase tracking-wider font-semibold mb-2">
            Recurrence Frequency
          </label>
          <select
            value={inputs.frequency}
            onChange={(e) => updateField('frequency', e.target.value as MeetingFrequency)}
            className="w-full bg-[#18191E] border border-[#2B2E38] rounded-lg px-3 py-2.5 font-mono text-sm text-[#F5EFEB] focus:outline-none focus:border-[#FF3B1E] cursor-pointer"
          >
            {FREQUENCY_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-[#121316]">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Multipliers */}
      <div className="border-t border-[#262830] pt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-xs font-mono text-[#888E9E] hover:text-[#EAECEF] cursor-pointer"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>{showAdvanced ? 'Hide loaded cost settings' : 'Loaded cost multiplier & prep time (currently 1.3×)'}</span>
        </button>

        {showAdvanced && (
          <div className="mt-3 p-4 bg-[#18191E] rounded-lg border border-[#262830] grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-[11px] font-mono text-[#888E9E] mb-1">
                <span>Loaded-Cost Multiplier (Benefits, Taxes, Overhead)</span>
                <span className="text-[#FF3B1E] font-bold">{inputs.loadedMultiplier}×</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={2.0}
                step={0.05}
                value={inputs.loadedMultiplier}
                onChange={(e) => updateField('loadedMultiplier', Number(e.target.value))}
                className="w-full accent-[#FF3B1E] cursor-pointer h-1.5 bg-[#262830] rounded"
              />
              <span className="text-[10px] text-[#636773] mt-1 block">
                Standard corporate fully loaded burden is 1.25× to 1.4× base salary.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono text-[#888E9E] mb-1">
                <span>Prep & Context-Switching Tax</span>
                <span className="text-[#FAF7F2] font-bold">{inputs.prepFollowupMinutes} min</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                step={5}
                value={inputs.prepFollowupMinutes}
                onChange={(e) => updateField('prepFollowupMinutes', Number(e.target.value))}
                className="w-full accent-[#FF3B1E] cursor-pointer h-1.5 bg-[#262830] rounded"
              />
              <span className="text-[10px] text-[#636773] mt-1 block">
                Average ramp-up and debrief minutes per attendee.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-4 bg-[#FF3B1E] hover:bg-[#E62E12] text-white font-mono font-extrabold text-base tracking-wider uppercase rounded-xl shadow-xl hover:shadow-[#FF3B1E]/25 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99]"
      >
        <Sparkles className="w-5 h-5" />
        <span>Audit meeting payroll & print receipt</span>
      </button>
    </form>
  );
};
