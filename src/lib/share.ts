import type { EmployeeInputs, EmployerInputs } from './calc';


export interface DecodedShareParams {
  mode: 'employee' | 'employer';
  employee?: Partial<EmployeeInputs>;
  employer?: Partial<EmployerInputs>;
}

/**
 * Encodes application state into compact URL query params
 */
export function encodeShareParams(
  mode: 'employee' | 'employer',
  employeeInputs: EmployeeInputs,
  employerInputs: EmployerInputs,
  includeSalaryInUrl = false
): string {
  const params = new URLSearchParams();
  params.set('m', mode === 'employee' ? 'ee' : 'er');

  if (mode === 'employee') {
    if (employeeInputs.name) params.set('u', employeeInputs.name);
    params.set('d', String(employeeInputs.meetingsPerDay));
    params.set('l', String(employeeInputs.avgMinutes));
    params.set('n', String(Math.round(employeeInputs.neededPct * 100)));
    params.set('c', employeeInputs.currency);
    if (includeSalaryInUrl && employeeInputs.payType !== 'none' && employeeInputs.payAmount) {
      params.set('pt', employeeInputs.payType);
      params.set('pa', String(employeeInputs.payAmount));
    }
  } else {
    if (employerInputs.companyOrTeam) params.set('org', employerInputs.companyOrTeam);
    params.set('a', String(employerInputs.attendees));
    params.set('nd', String(employerInputs.needed));
    params.set('dm', String(employerInputs.durationMinutes));
    params.set('pm', String(employerInputs.prepFollowupMinutes));
    params.set('f', employerInputs.frequency);
    params.set('c', employerInputs.currency);
    params.set('lm', String(employerInputs.loadedMultiplier));
    if (includeSalaryInUrl && employerInputs.annualSalaryPerAttendee) {
      params.set('sa', String(employerInputs.annualSalaryPerAttendee));
    }
  }

  return params.toString();
}

/**
 * Decodes URL search query into form state
 */
export function decodeShareParams(search: string): DecodedShareParams | null {
  if (!search || search === '?') return null;
  const p = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);

  const rawMode = p.get('m');
  if (!rawMode) return null;

  const mode = rawMode === 'er' || rawMode === 'employer' ? 'employer' : 'employee';

  if (mode === 'employee') {
    const d = p.get('d') ? Number(p.get('d')) : undefined;
    const l = p.get('l') ? Number(p.get('l')) : undefined;
    const n = p.get('n') ? Number(p.get('n')) / 100 : undefined;
    const c = p.get('c') || undefined;
    const u = p.get('u') || undefined;
    const pt = (p.get('pt') as any) || undefined;
    const pa = p.get('pa') ? Number(p.get('pa')) : undefined;

    return {
      mode: 'employee',
      employee: {
        name: u,
        meetingsPerDay: d,
        avgMinutes: l,
        neededPct: n,
        currency: c,
        payType: pt,
        payAmount: pa,
      },
    };
  } else {
    const a = p.get('a') ? Number(p.get('a')) : undefined;
    const nd = p.get('nd') ? Number(p.get('nd')) : undefined;
    const dm = p.get('dm') ? Number(p.get('dm')) : undefined;
    const pm = p.get('pm') ? Number(p.get('pm')) : undefined;
    const f = (p.get('f') as any) || undefined;
    const c = p.get('c') || undefined;
    const lm = p.get('lm') ? Number(p.get('lm')) : undefined;
    const sa = p.get('sa') ? Number(p.get('sa')) : undefined;
    const org = p.get('org') || undefined;

    return {
      mode: 'employer',
      employer: {
        companyOrTeam: org,
        attendees: a,
        needed: nd,
        durationMinutes: dm,
        prepFollowupMinutes: pm,
        frequency: f,
        currency: c,
        loadedMultiplier: lm,
        annualSalaryPerAttendee: sa,
      },
    };
  }
}

/**
 * Builds prefilled punchy social copy
 */
export function buildSocialShareCopy(
  mode: 'employee' | 'employer',
  hoursOrAttendees: number,
  workdaysOrCostString: string,
  shareUrl: string
): {
  twitterText: string;
  linkedinText: string;
} {
  if (mode === 'employee') {
    const twitterText = `I wasted ${hoursOrAttendees} hours (${workdaysOrCostString}) of my life in unwanted meetings.\n\nIn that time, I could have completed Anthropic's Claude prompting course, hit the gym, or shipped real code.\n\nTally your meeting tax:`;
    const linkedinText = `I wasted ${hoursOrAttendees} hours (${workdaysOrCostString}) of my life in unwanted meetings.\n\nTime in which I could have:\n• Completed Anthropic's Claude Prompting Course\n• Hit 150+ intense gym sessions & fitness PRs\n• Shipped real engineering side projects\n• Read foundational system architecture books\n\nInstead, I sat muted as an audience member.\n\nCalculate your calendar tax with MeetingTax:\n${shareUrl}`;
    return {
      twitterText,
      linkedinText,
    };
  } else {
    const twitterText = `Our team burns ${workdaysOrCostString} annually in spectator meetings. Time our builders could have spent shipping real features:\n\nTally your team's meeting tax:`;
    const linkedinText = `Meeting Audit: Our team burns ${workdaysOrCostString} every year on meetings with non-essential attendees.\n\nTime our builders could have spent shipping real features instead of being silent passengers in business syncs.\n\nAudit your meeting calendar:\n${shareUrl}`;
    return {
      twitterText,
      linkedinText,
    };
  }
}

/**
 * Open X / Twitter share intent
 */
export function openTwitterShare(text: string, url: string): void {
  const target = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(target, '_blank', 'noopener,noreferrer');
}

/**
 * Open LinkedIn share intent
 */
export function openLinkedInShare(url: string, _title?: string, _summary?: string): void {
  const target = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(target, '_blank', 'noopener,noreferrer');
}
