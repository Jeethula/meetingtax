import { CURRENCIES } from '../data/currencies';
import {
  getRandomOpportunities,
  calculate10YrIndexCompound,
  EMPLOYER_EQUIVALENTS,
} from '../data/opportunities';
import type { OpportunityDisplay } from '../data/opportunities';

export type PayType = 'annual' | 'monthly' | 'hourly' | 'none';
export type MeetingFrequency = 'one-off' | 'daily' | 'weekly' | 'biweekly' | 'monthly';

export interface EmployeeInputs {
  name?: string;
  meetingsPerDay: number;
  avgMinutes: number;
  neededPct: number; // 0.0 to 1.0 (e.g. 0.40 for 40%)
  payType: PayType;
  payAmount?: number;
  currency: string;
  workingDaysPerYear?: number;
  assumedIndexReturnPct?: number;
  opportunitySeed?: number;
}

export interface EmployeeResult {
  meetingsPerDay: number;
  avgMinutes: number;
  neededPct: number;
  wastePct: number;
  minutesWastedPerDay: number;
  hoursWastedPerWeek: number;
  hoursWastedPerYear: number;
  workdaysWastedPerYear: number;
  hourlyRate: number | null;
  annualSalaryEstimated: number | null;
  moneyWastedPerYear: number | null;
  topOpportunities: OpportunityDisplay[];
  tenYearCompoundCorpus: number | null;
  assumedIndexReturnPct: number;
  workingDaysPerYear: number;
  currency: string;
}

export interface EmployerInputs {
  companyOrTeam?: string;
  attendees: number;
  needed: number;
  durationMinutes: number;
  prepFollowupMinutes: number;
  frequency: MeetingFrequency;
  annualSalaryPerAttendee: number;
  loadedMultiplier: number;
  currency: string;
  workingDaysPerYear?: number;
}

export interface EmployerResult {
  attendees: number;
  needed: number;
  otherAttendees: number;
  otherNeededRatio: number;
  wastedAttendees: number;
  wasteRatio: number;
  durationMinutes: number;
  prepFollowupMinutes: number;
  totalTimeMinutes: number;
  frequency: MeetingFrequency;
  frequencyMultiplier: number;
  hourlyLoadedRate: number;
  costPerAttendee: number;
  singleMeetingTotalCost: number;
  singleMeetingWastedCost: number;
  costPerMinute: number;
  annualTotalCost: number;
  annualWastedCost: number;
  annualHoursWasted: number;
  equivalents: { id: string; count: number; text: string }[];
  currency: string;
  workingDaysPerYear: number;
  loadedMultiplier: number;
}

export const FREQUENCY_MULTIPLIERS: Record<MeetingFrequency, number> = {
  'one-off': 1,
  'daily': 230,
  'weekly': 48,
  'biweekly': 24,
  'monthly': 12,
};

/**
 * Defensive clamping helper
 */
export function clamp(val: number, min: number, max: number): number {
  if (isNaN(val) || !isFinite(val)) return min;
  return Math.min(Math.max(val, min), max);
}

/**
 * Derives normalized hourly rate from pay options
 */
export function deriveHourlyRate(
  payType: PayType,
  payAmount: number | undefined,
  workingDaysPerYear = 230
): number | null {
  if (payType === 'none' || payAmount === undefined || payAmount <= 0 || isNaN(payAmount)) {
    return null;
  }
  const safeDays = Math.max(1, workingDaysPerYear);
  const totalHours = safeDays * 8;

  switch (payType) {
    case 'hourly':
      return payAmount;
    case 'monthly':
      return (payAmount * 12) / totalHours;
    case 'annual':
      return payAmount / totalHours;
    default:
      return null;
  }
}

/**
 * Derives annual salary equivalent
 */
export function deriveAnnualSalary(
  payType: PayType,
  payAmount: number | undefined,
  workingDaysPerYear = 230
): number | null {
  const hourly = deriveHourlyRate(payType, payAmount, workingDaysPerYear);
  if (hourly === null) return null;
  return hourly * workingDaysPerYear * 8;
}

/**
 * Computes Employee meeting waste metrics
 */
export function calculateEmployeeTax(inputs: EmployeeInputs): EmployeeResult {
  const workingDays = clamp(inputs.workingDaysPerYear ?? 230, 50, 365);
  const meetingsPerDay = clamp(inputs.meetingsPerDay, 0, 24);
  const avgMinutes = clamp(inputs.avgMinutes, 0, 480);
  const neededPct = clamp(inputs.neededPct, 0, 1);
  const wastePct = 1 - neededPct;

  // Daily wasted minutes
  const totalDailyMinutes = meetingsPerDay * avgMinutes;
  const minutesWastedPerDay = Math.round(totalDailyMinutes * wastePct);

  // Weekly hours wasted (5 workdays/week)
  const hoursWastedPerWeek = Number(((minutesWastedPerDay * 5) / 60).toFixed(1));

  // Yearly wasted hours: meetingsPerDay * avgMinutes * (1 - neededPct) * workingDaysPerYear / 60
  const hoursWastedPerYear = Math.round((minutesWastedPerDay * workingDays) / 60);

  // Full 8-hour workdays lost
  const workdaysWastedPerYear = Math.round(hoursWastedPerYear / 8);

  // Financial impact if pay provided
  const hourlyRate = deriveHourlyRate(inputs.payType, inputs.payAmount, workingDays);
  const annualSalaryEstimated = deriveAnnualSalary(inputs.payType, inputs.payAmount, workingDays);
  const moneyWastedPerYear = hourlyRate !== null ? Math.round(hoursWastedPerYear * hourlyRate) : null;

  // Opportunities calculation (picks 4 diverse items from 200 items in JSON)
  const topOpportunities = getRandomOpportunities(
    hoursWastedPerYear,
    4,
    inputs.opportunitySeed ?? (hoursWastedPerYear + 42)
  );

  // Index fund compound simulation (illustrative)
  const currConfig = CURRENCIES[inputs.currency] || CURRENCIES.INR;
  const assumedReturn = inputs.assumedIndexReturnPct ?? currConfig.defaultIndexReturnPct;
  const compoundCorpus = moneyWastedPerYear !== null && moneyWastedPerYear > 0
    ? calculate10YrIndexCompound(moneyWastedPerYear, assumedReturn).futureValue
    : null;

  return {
    meetingsPerDay,
    avgMinutes,
    neededPct,
    wastePct,
    minutesWastedPerDay,
    hoursWastedPerWeek,
    hoursWastedPerYear,
    workdaysWastedPerYear,
    hourlyRate: hourlyRate !== null ? Math.round(hourlyRate) : null,
    annualSalaryEstimated: annualSalaryEstimated !== null ? Math.round(annualSalaryEstimated) : null,
    moneyWastedPerYear,
    topOpportunities,
    tenYearCompoundCorpus: compoundCorpus,
    assumedIndexReturnPct: assumedReturn,
    workingDaysPerYear: workingDays,
    currency: inputs.currency || 'INR',
  };
}

/**
 * Computes Employer meeting waste metrics
 */
export function calculateEmployerTax(inputs: EmployerInputs): EmployerResult {
  const workingDays = clamp(inputs.workingDaysPerYear ?? 230, 50, 365);
  const attendees = clamp(inputs.attendees, 1, 200);
  const needed = clamp(inputs.needed, 0, attendees);
  const otherAttendees = Math.max(0, attendees - needed);

  // Non-core attendees are typically needed for ~15% of the sync (quick turn / doubts),
  // leaving 85% of their time as idle spectator waste.
  const otherNeededRatio = 0.15;
  const otherWasteRatio = 1 - otherNeededRatio; // 0.85
  const wastedAttendees = otherAttendees * otherWasteRatio;
  const wasteRatio = attendees > 0 ? wastedAttendees / attendees : 0;

  const durationMinutes = clamp(inputs.durationMinutes, 1, 480);
  const prepFollowupMinutes = clamp(inputs.prepFollowupMinutes, 0, 240);
  const totalTimeMinutes = durationMinutes + prepFollowupMinutes;

  const salary = Math.max(0, inputs.annualSalaryPerAttendee);
  const loadedMultiplier = clamp(inputs.loadedMultiplier, 1.0, 3.0);
  const hourlyBaseRate = salary / (workingDays * 8);
  const hourlyLoadedRate = hourlyBaseRate * loadedMultiplier;

  // Single meeting calculations
  const meetingHours = totalTimeMinutes / 60;
  const costPerAttendee = meetingHours * hourlyLoadedRate;
  const singleMeetingTotalCost = Math.round(attendees * costPerAttendee);
  const singleMeetingWastedCost = Math.round(wastedAttendees * costPerAttendee);

  const costPerMinute = durationMinutes > 0 ? singleMeetingTotalCost / durationMinutes : 0;

  // Annualized calculations
  const frequency = inputs.frequency;
  const frequencyMultiplier = FREQUENCY_MULTIPLIERS[frequency] || 1;
  const annualTotalCost = Math.round(singleMeetingTotalCost * frequencyMultiplier);
  const annualWastedCost = Math.round(singleMeetingWastedCost * frequencyMultiplier);
  const annualHoursWasted = Math.round((wastedAttendees * meetingHours) * frequencyMultiplier);

  // Equivalents (e.g. junior hires, team offsites, SaaS licenses)
  const curr = CURRENCIES[inputs.currency] || CURRENCIES.INR;
  // Convert currency to approximate USD baseline for equivalent ratios
  const usdToCurrencyRatio = curr.defaultAnnualSalary / 110000;

  const equivalents = EMPLOYER_EQUIVALENTS.map((eq) => {
    const localCostUnit = eq.baselineUsd * usdToCurrencyRatio;
    const count = Math.max(0, Math.floor(annualWastedCost / (localCostUnit || 1)));
    return {
      id: eq.id,
      count,
      text: eq.formatText(Math.max(1, count), curr.symbol),
    };
  });

  return {
    attendees,
    needed,
    otherAttendees,
    otherNeededRatio,
    wastedAttendees: Number(wastedAttendees.toFixed(1)),
    wasteRatio,
    durationMinutes,
    prepFollowupMinutes,
    totalTimeMinutes,
    frequency,
    frequencyMultiplier,
    hourlyLoadedRate: Math.round(hourlyLoadedRate),
    costPerAttendee: Math.round(costPerAttendee),
    singleMeetingTotalCost,
    singleMeetingWastedCost,
    costPerMinute: Number(costPerMinute.toFixed(2)),
    annualTotalCost,
    annualWastedCost,
    annualHoursWasted,
    equivalents,
    currency: inputs.currency || 'INR',
    workingDaysPerYear: workingDays,
    loadedMultiplier,
  };
}
