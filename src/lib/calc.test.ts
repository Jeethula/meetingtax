import { describe, it, expect } from 'vitest';
import {
  calculateEmployeeTax,
  calculateEmployerTax,
  deriveHourlyRate,
  clamp,
} from './calc';
import { calculate10YrIndexCompound } from '../data/opportunities';

describe('calc engine', () => {
  it('correctly clamps values within range and handles NaN', () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(NaN, 0, 10)).toBe(0);
  });

  describe('deriveHourlyRate', () => {
    it('calculates hourly rate from annual salary', () => {
      // 18,40,000 / (230 * 8 = 1840) = 1000
      const rate = deriveHourlyRate('annual', 1840000, 230);
      expect(rate).toBe(1000);
    });

    it('calculates hourly rate from monthly salary', () => {
      // (100,000 * 12) / (230 * 8 = 1840) ≈ 652.17
      const rate = deriveHourlyRate('monthly', 100000, 230);
      expect(rate).toBeCloseTo(652.17, 1);
    });

    it('returns direct hourly rate when payType is hourly', () => {
      const rate = deriveHourlyRate('hourly', 75, 230);
      expect(rate).toBe(75);
    });

    it('returns null when payType is none or invalid', () => {
      expect(deriveHourlyRate('none', 100000)).toBeNull();
      expect(deriveHourlyRate('annual', 0)).toBeNull();
    });
  });

  describe('calculateEmployeeTax', () => {
    it('calculates wasted hours and salary according to specification', () => {
      // 5 meetings/day, 30 min avg, 40% needed (60% wasted), 230 working days
      // Daily total: 5 * 30 = 150 mins
      // Daily wasted: 150 * 0.6 = 90 mins
      // Yearly wasted hours: (90 * 230) / 60 = 20700 / 60 = 345 hours
      // Full workdays: 345 / 8 ≈ 43 days
      const result = calculateEmployeeTax({
        meetingsPerDay: 5,
        avgMinutes: 30,
        neededPct: 0.40,
        payType: 'annual',
        payAmount: 1280000, // 1280000 / (230*8 = 1840) = 695.65/hr
        currency: 'INR',
        workingDaysPerYear: 230,
      });

      expect(result.minutesWastedPerDay).toBe(90);
      expect(result.hoursWastedPerYear).toBe(345);
      expect(result.workdaysWastedPerYear).toBe(43);
      expect(result.moneyWastedPerYear).toBeGreaterThan(0);
      expect(result.topOpportunities.length).toBe(4);
    });

    it('handles skipped pay gracefully (time-only mode)', () => {
      const result = calculateEmployeeTax({
        meetingsPerDay: 4,
        avgMinutes: 45,
        neededPct: 0.5,
        payType: 'none',
        currency: 'USD',
      });

      expect(result.hoursWastedPerYear).toBeGreaterThan(0);
      expect(result.moneyWastedPerYear).toBeNull();
      expect(result.tenYearCompoundCorpus).toBeNull();
    });
  });

  describe('calculateEmployerTax', () => {
    it('calculates single meeting waste and annualized recurring waste', () => {
      // 8 attendees, 2 needed => 6 other attendees
      // Non-core attendees participate ~15% (quick questions/updates), leaving 85% idle spectator time
      // 6 * 0.85 = 5.1 wasted attendees
      // 60 min meeting + 0 prep
      // Annual salary 18,40,000 / (230*8) = 1,000/hr base rate
      // Loaded multiplier 1.3 => 1,300/hr loaded rate
      // Single meeting total cost: 8 * (1 hr * 1300) = 10,400
      // Single meeting wasted cost: 5.1 * (1 hr * 1300) = 6,630
      // Weekly recurrence (48 weeks): 6630 * 48 = 318,240
      const result = calculateEmployerTax({
        attendees: 8,
        needed: 2,
        durationMinutes: 60,
        prepFollowupMinutes: 0,
        frequency: 'weekly',
        annualSalaryPerAttendee: 1840000,
        loadedMultiplier: 1.3,
        currency: 'INR',
        workingDaysPerYear: 230,
      });

      expect(result.otherAttendees).toBe(6);
      expect(result.otherNeededRatio).toBe(0.15);
      expect(result.wastedAttendees).toBe(5.1);
      expect(result.singleMeetingTotalCost).toBe(10400);
      expect(result.singleMeetingWastedCost).toBe(6630);
      expect(result.frequencyMultiplier).toBe(48);
      expect(result.annualWastedCost).toBe(318240);
      expect(result.costPerMinute).toBeCloseTo(173.33, 1);
    });

    it('handles 100% efficient meetings with 0 waste without breaking', () => {
      const result = calculateEmployerTax({
        attendees: 4,
        needed: 4,
        durationMinutes: 30,
        prepFollowupMinutes: 0,
        frequency: 'one-off',
        annualSalaryPerAttendee: 100000,
        loadedMultiplier: 1.3,
        currency: 'USD',
      });

      expect(result.wastedAttendees).toBe(0);
      expect(result.singleMeetingWastedCost).toBe(0);
      expect(result.annualWastedCost).toBe(0);
    });
  });

  describe('calculate10YrIndexCompound', () => {
    it('compounds monthly contributions over 10 years', () => {
      // 120,000 annual => 10,000 monthly, 10% annual return
      const compound = calculate10YrIndexCompound(120000, 10);
      expect(compound.totalContributed).toBe(1200000);
      expect(compound.futureValue).toBeGreaterThan(1200000);
      expect(compound.wealthGain).toBe(compound.futureValue - compound.totalContributed);
    });
  });
});
