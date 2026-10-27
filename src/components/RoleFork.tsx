import React from 'react';
import { User, Building2 } from 'lucide-react';

interface RoleForkProps {
  mode: 'employee' | 'employer';
  onSelectMode: (mode: 'employee' | 'employer') => void;
}

export const RoleFork: React.FC<RoleForkProps> = ({ mode, onSelectMode }) => {
  return (
    <div className="mb-12">
      <div className="text-center mb-6">
        <span className="font-mono text-xs uppercase tracking-widest text-[#FF3B1E] font-bold">
          SECTION C // THE FORK
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold font-headline text-[#F5EFEB] mt-1">
          Who is filing this audit?
        </h2>
        <p className="text-sm text-[#888E9E] mt-1 font-mono">
          Select your perspective to calibrate the calculation ledger.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {/* Employee Option */}
        <button
          type="button"
          onClick={() => onSelectMode('employee')}
          className={`relative p-5 sm:p-6 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            mode === 'employee'
              ? 'bg-[#18191E] border-[#FF3B1E] shadow-lg shadow-[#FF3B1E]/10 ring-1 ring-[#FF3B1E]'
              : 'bg-[#121316] border-[#252830] hover:border-[#383C48] text-[#888E9E]'
          }`}
        >
          {mode === 'employee' && (
            <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#FF3B1E]" />
          )}
          <div>
            <div className={`p-2.5 rounded-lg inline-block mb-3 ${
              mode === 'employee' ? 'bg-[#FF3B1E]/15 text-[#FF3B1E]' : 'bg-[#1D1E24] text-[#888E9E]'
            }`}>
              <User className="w-5 h-5" />
            </div>
            <h3 className={`font-headline text-lg sm:text-xl font-bold mb-1 ${
              mode === 'employee' ? 'text-[#FAF7F2]' : 'text-[#B8BCC8]'
            }`}>
              I’m an Employee
            </h3>
            <p className="text-xs sm:text-sm text-[#888E9E] leading-relaxed">
              "How much of my finite lifespan and salary are swallowed by calendar invites?"
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#262830] font-mono text-[11px] text-[#FF3B1E] font-semibold">
            METRICS: HOURS LOST · CAREER DELAYS · SALARY VALUE
          </div>
        </button>

        {/* Employer Option */}
        <button
          type="button"
          onClick={() => onSelectMode('employer')}
          className={`relative p-5 sm:p-6 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
            mode === 'employer'
              ? 'bg-[#18191E] border-[#FF3B1E] shadow-lg shadow-[#FF3B1E]/10 ring-1 ring-[#FF3B1E]'
              : 'bg-[#121316] border-[#252830] hover:border-[#383C48] text-[#888E9E]'
          }`}
        >
          {mode === 'employer' && (
            <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#FF3B1E]" />
          )}
          <div>
            <div className={`p-2.5 rounded-lg inline-block mb-3 ${
              mode === 'employer' ? 'bg-[#FF3B1E]/15 text-[#FF3B1E]' : 'bg-[#1D1E24] text-[#888E9E]'
            }`}>
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className={`font-headline text-lg sm:text-xl font-bold mb-1 ${
              mode === 'employer' ? 'text-[#FAF7F2]' : 'text-[#B8BCC8]'
            }`}>
              I’m a Leader / Employer
            </h3>
            <p className="text-xs sm:text-sm text-[#888E9E] leading-relaxed">
              "What is this recurring sync actually draining in team payroll and spectator hours?"
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#262830] font-mono text-[11px] text-[#FF3B1E] font-semibold">
            METRICS: TOTAL PAYROLL · SPECTATOR DRAIN · RECURRING WASTE
          </div>
        </button>
      </div>
    </div>
  );
};
