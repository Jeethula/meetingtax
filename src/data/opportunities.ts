import rawOpportunities from './opportunitiesList.json';

export interface RawOpportunity {
  id: string;
  category: 'learning' | 'fitness' | 'shipping' | 'reading' | 'life';
  hoursNeeded: number;
  format: string;
}

export interface OpportunityDisplay {
  id: string;
  count: number;
  text: string;
  category: string;
}

export const ALL_OPPORTUNITIES: RawOpportunity[] = rawOpportunities as RawOpportunity[];

/**
 * Deterministic PRNG to pick varied, category-balanced items from the 200 items in JSON.
 * Picks 4 items (learning/course, fitness/gym, shipping/projects, life/reading).
 */
export function getRandomOpportunities(
  hoursWasted: number,
  count = 4,
  seed = Date.now()
): OpportunityDisplay[] {
  const safeHours = Math.max(hoursWasted, 1);
  
  // Custom simple hash
  const pseudoRandom = (offset: number) => {
    const x = Math.sin(seed + offset * 997) * 10000;
    return x - Math.floor(x);
  };

  const selected: OpportunityDisplay[] = [];

  // Pick across distinct categories
  const targetCategories = ['learning', 'fitness', 'shipping', pseudoRandom(1) > 0.5 ? 'reading' : 'life'];

  targetCategories.slice(0, count).forEach((cat, idx) => {
    const pool = ALL_OPPORTUNITIES.filter((o) => o.category === cat);
    if (pool.length === 0) return;

    // Filter by reasonable fit, or pick best match
    const fitting = pool.filter((o) => o.hoursNeeded <= safeHours * 1.5);
    const candidateList = fitting.length > 0 ? fitting : pool;

    const chosenIdx = Math.floor(pseudoRandom(idx + 10) * candidateList.length);
    const item = candidateList[chosenIdx] || pool[0];

    const rawCount = Math.floor(safeHours / item.hoursNeeded);
    const displayCount = Math.max(1, rawCount);

    let formatted = item.format
      .replace('{n}', String(displayCount))
      .replace('{s}', displayCount === 1 ? '' : 's')
      .replace('{es}', displayCount === 1 ? '' : 'es');

    selected.push({
      id: item.id,
      count: displayCount,
      text: formatted,
      category: item.category,
    });
  });

  return selected;
}

export interface EmployerEquivalent {
  id: string;
  baselineUsd: number;
  labelSingular: string;
  formatText: (count: number, currencySymbol: string) => string;
}

export const EMPLOYER_EQUIVALENTS: EmployerEquivalent[] = [
  {
    id: 'junior_hire',
    baselineUsd: 45000,
    labelSingular: 'Junior engineer or analyst',
    formatText: (n) => `Funded ${n} full-time junior hire${n === 1 ? '' : 's'}`,
  },
  {
    id: 'offsite',
    baselineUsd: 8000,
    labelSingular: 'Team strategic offsite',
    formatText: (n) => `Held ${n} high-impact team offsite${n === 1 ? '' : 's'}`,
  },
  {
    id: 'saas',
    baselineUsd: 1200,
    labelSingular: 'Annual seat of top-tier SaaS',
    formatText: (n) => `Paid for ${n} whole year${n === 1 ? '' : 's'} of elite tooling (Linear/Figma/GitHub)`,
  },
];

/**
 * Calculates 10-year compound interest for an investment made monthly
 */
export function calculate10YrIndexCompound(annualAmount: number, annualReturnRatePct = 10): {
  totalContributed: number;
  futureValue: number;
  wealthGain: number;
} {
  const years = 10;
  const monthlyContribution = Math.max(0, annualAmount / 12);
  const r = annualReturnRatePct / 100;
  const monthlyRate = r / 12;
  const totalMonths = years * 12;

  if (monthlyRate === 0) {
    const totalContributed = monthlyContribution * totalMonths;
    return { totalContributed, futureValue: totalContributed, wealthGain: 0 };
  }

  const futureValue = monthlyContribution * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  const totalContributed = monthlyContribution * totalMonths;
  const wealthGain = Math.max(0, futureValue - totalContributed);

  return {
    totalContributed: Math.round(totalContributed),
    futureValue: Math.round(futureValue),
    wealthGain: Math.round(wealthGain),
  };
}
