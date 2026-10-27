export type AnalyticsEvent =
  | 'role_selected'
  | 'card_generated'
  | 'share_clicked'
  | 'download_clicked'
  | 'currency_changed'
  | 'opportunities_rerolled';

export function track(event: AnalyticsEvent, payload?: Record<string, any>): void {
  if (typeof window !== 'undefined' && (window as any).va) {
    (window as any).va('event', { name: event, data: payload });
  }

  if (import.meta.env.DEV) {
    // console.log(`[MeetingTax Analytics] ${event}`, payload);
  }
}
