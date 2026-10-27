import { CURRENCIES, DEFAULT_CURRENCY } from '../data/currencies';

/**
 * Format currency with locale-specific digit grouping
 */
export function formatCurrency(
  amount: number | null | undefined,
  currencyCode = DEFAULT_CURRENCY,
  options?: {
    compact?: boolean;
    hideDecimals?: boolean;
  }
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '—';
  }

  const config = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const absAmount = Math.abs(amount);

  // Compact Indian notation for large INR amounts
  if (options?.compact && currencyCode === 'INR') {
    if (absAmount >= 10000000) {
      return `${config.symbol}${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (absAmount >= 100000) {
      return `${config.symbol}${(amount / 100000).toFixed(1)} L`;
    }
    if (absAmount >= 1000) {
      return `${config.symbol}${(amount / 1000).toFixed(1)}k`;
    }
  }

  // Compact Western notation for USD/EUR/etc.
  if (options?.compact) {
    if (absAmount >= 1000000) {
      return `${config.symbol}${(amount / 1000000).toFixed(1)}M`;
    }
    if (absAmount >= 1000) {
      return `${config.symbol}${(amount / 1000).toFixed(1)}k`;
    }
  }

  const formatter = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.code,
    maximumFractionDigits: options?.hideDecimals !== false ? 0 : 2,
    minimumFractionDigits: 0,
  });

  return formatter.format(amount);
}

/**
 * Format plain numbers with locale thousands separators
 */
export function formatNumber(num: number | null | undefined, currencyCode = DEFAULT_CURRENCY): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  const config = CURRENCIES[currencyCode] || CURRENCIES.INR;
  return new Intl.NumberFormat(config.locale).format(num);
}

/**
 * Format minutes into human-readable hours and minutes
 */
export function formatMinutes(mins: number): string {
  if (mins <= 0) return '0 min';
  if (mins < 60) return `${mins} min`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (remainingMins === 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
  return `${hours}h ${remainingMins}m`;
}

/**
 * Format hours into clean string
 */
export function formatHours(hrs: number): string {
  if (hrs <= 0) return '0 hrs';
  return `${formatNumber(hrs)} hrs`;
}

/**
 * Format percentage
 */
export function formatPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}
