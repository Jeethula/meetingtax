export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  defaultAnnualSalary: number;
  defaultHourlyRate: number;
  // Default loaded-cost multiplier assumption
  defaultLoadedMultiplier: number;
  // S&P 500 / Index average historical return expectation
  defaultIndexReturnPct: number;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee (₹)',
    locale: 'en-IN',
    defaultAnnualSalary: 1800000, // ₹18 LPA (~$21k) typical mid-level tech/corp
    defaultHourlyRate: 978, // ~18L / (230 * 8)
    defaultLoadedMultiplier: 1.3,
    defaultIndexReturnPct: 12.0, // Nifty 50 historical long-term average ~12%
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar ($)',
    locale: 'en-US',
    defaultAnnualSalary: 110000,
    defaultHourlyRate: 60,
    defaultLoadedMultiplier: 1.35,
    defaultIndexReturnPct: 10.0, // S&P 500 historical average ~10%
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro (€)',
    locale: 'de-DE',
    defaultAnnualSalary: 68000,
    defaultHourlyRate: 37,
    defaultLoadedMultiplier: 1.38,
    defaultIndexReturnPct: 8.5,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound (£)',
    locale: 'en-GB',
    defaultAnnualSalary: 62000,
    defaultHourlyRate: 34,
    defaultLoadedMultiplier: 1.3,
    defaultIndexReturnPct: 8.5,
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham (AED)',
    locale: 'en-AE',
    defaultAnnualSalary: 240000,
    defaultHourlyRate: 130,
    defaultLoadedMultiplier: 1.25,
    defaultIndexReturnPct: 9.0,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar (S$)',
    locale: 'en-SG',
    defaultAnnualSalary: 96000,
    defaultHourlyRate: 52,
    defaultLoadedMultiplier: 1.28,
    defaultIndexReturnPct: 9.0,
  },
};

export const DEFAULT_CURRENCY = 'INR';

export function detectUserCurrency(): string {
  try {
    const userLocale = navigator.language || '';
    if (userLocale.includes('IN')) return 'INR';
    if (userLocale.includes('US')) return 'USD';
    if (userLocale.includes('GB')) return 'GBP';
    if (userLocale.includes('AE')) return 'AED';
    if (userLocale.includes('SG')) return 'SGD';
    if (/FR|DE|IT|ES|NL|BE|AT|IE|PT|FI|GR/.test(userLocale)) return 'EUR';
  } catch {
    // fallback
  }
  return DEFAULT_CURRENCY;
}
