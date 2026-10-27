export interface Verdict {
  tier: 'catastrophic' | 'severe' | 'moderate' | 'reasonable';
  stampText: string;
  headline: string;
  subhead: string;
  suggestedAlternative: string;
  punchline: string;
}

const EMPLOYEE_VERDICTS: Record<Verdict['tier'], { headlines: string[]; alternatives: string[]; punchlines: string[] }> = {
  catastrophic: {
    headlines: [
      'Half your week is a calendar invite.',
      'You are paid to attend your own hostage situation.',
      'You are a professional listener with a side job.',
      'Your calendar is an open-buffet crime scene.',
    ],
    alternatives: [
      'Decline by default. Ask for a 3-bullet async brief before accepting anything.',
      'Block 4 hours of daily "Do Not Schedule" focus blocks and protect them with your life.',
      'Propose replacing recurring status syncs with a 3-minute written Monday recap.',
    ],
    punchlines: [
      'If you dropped off right now, would anyone notice before minute 45?',
      'You don’t need an agenda. You need an escape pod.',
      'Even your mute button is getting RSI.',
    ],
  },
  severe: {
    headlines: [
      'Heavy meeting toll. You are bleeding focus.',
      'Over-scheduled and under-producing.',
      'Significant calendar tax detected.',
    ],
    alternatives: [
      'Request agendas 24 hours in advance; no agenda = no attendance.',
      'Cap 30-minute meetings at 20, and 60-minute meetings at 45.',
      'Send a crisp Slack/Teams update instead of a verbal status report.',
    ],
    punchlines: [
      'You could have written a bestselling book with this time.',
      'Multitasking in meetings is just feeling guilty in two windows at once.',
    ],
  },
  moderate: {
    headlines: [
      'Manageable, but calendar creep is starting.',
      'Noticeable leak in your weekly output.',
    ],
    alternatives: [
      'Audit your weekly recurrings. Prune the stale ones.',
      'Replace the next status meeting with a quick shared document.',
    ],
    punchlines: [
      'Watch your calendar before it turns into a full-time theater production.',
    ],
  },
  reasonable: {
    headlines: [
      'Unusually disciplined. Keep the perimeter secure.',
      'Actually reasonable. You have genuine focus time.',
    ],
    alternatives: [
      'Keep it short, keep it rare. Never let 15-minute syncs inflate to 30.',
      'Guard this schedule zealously. Calendar entropy is ruthless.',
    ],
    punchlines: [
      'You are among the rare 10% who actually do the work they were hired for.',
    ],
  },
};

const EMPLOYER_VERDICTS: Record<Verdict['tier'], { headlines: string[]; alternatives: string[]; punchlines: string[] }> = {
  catastrophic: {
    headlines: [
      'Cancel it. Send the doc.',
      'This meeting is burning payroll like kindling.',
      'You are funding an audience, not a decision.',
      'Astronomical meeting tax. Red line this invite.',
    ],
    alternatives: [
      'Slash the invite list to the 2 people who decide. Share decisions async with the rest.',
      'Mandate a 2-page pre-read memo. If nobody read it, cancel and reschedule.',
      'Enforce Amazon-style silent reading or replace with a Notion/Loom thread.',
    ],
    punchlines: [
      'At this burn rate, you could hire an entire extra squad.',
      'Every minute costs more than a fine dinner.',
    ],
  },
  severe: {
    headlines: [
      'This is expensive. Consider an async update.',
      'Payroll hemorrhage in the boardroom.',
      'Too many spectators, not enough decision-makers.',
    ],
    alternatives: [
      'Trim attendees by 40% and move status updates to Slack.',
      'Default to 25 minutes instead of 50 minutes.',
      'Designate one DRI (Directly Responsible Individual) and release bystanders.',
    ],
    punchlines: [
      'A meeting without an agenda is a group brainstorm at shareholder expense.',
    ],
  },
  moderate: {
    headlines: [
      'Slightly bloated attendance.',
      'Modest over-expenditure on discussion.',
    ],
    alternatives: [
      'Make presence optional for non-decision-makers with async minutes provided.',
      'Cap recurrence to bi-weekly instead of weekly.',
    ],
    punchlines: [
      'Keep it tight before the calendar expands to fill available budgets.',
    ],
  },
  reasonable: {
    headlines: [
      'High signal-to-noise ratio. Lean and focused.',
      'Cost-justified alignment session.',
    ],
    alternatives: [
      'Fine. Keep it short, keep it rare.',
      'Document action items within 15 minutes of conclusion.',
    ],
    punchlines: [
      'Rare sight: a meeting that might actually justify its payroll.',
    ],
  },
};

function pickRandom<T>(arr: T[], seed = 0): T {
  if (arr.length === 0) return '' as unknown as T;
  const idx = Math.abs(seed) % arr.length;
  return arr[idx];
}

/**
 * Returns a blunt, dry, professional verdict based on calculated waste
 */
export function getVerdict(
  mode: 'employee' | 'employer',
  wasteRatio: number, // 0.0 to 1.0
  hoursOrCost: number,
  seed = Date.now()
): Verdict {
  let tier: Verdict['tier'];
  let stampText: string;

  if (mode === 'employee') {
    if (wasteRatio >= 0.55 || hoursOrCost >= 300) {
      tier = 'catastrophic';
      stampText = 'WASTED';
    } else if (wasteRatio >= 0.35 || hoursOrCost >= 160) {
      tier = 'severe';
      stampText = 'OVERTAXED';
    } else if (wasteRatio >= 0.20 || hoursOrCost >= 80) {
      tier = 'moderate';
      stampText = 'SUBOPTIMAL';
    } else {
      tier = 'reasonable';
      stampText = 'EFFICIENT';
    }

    const dict = EMPLOYEE_VERDICTS[tier];
    return {
      tier,
      stampText,
      headline: pickRandom(dict.headlines, seed),
      subhead: `Waste ratio: ${Math.round(wasteRatio * 100)}% of scheduled meeting hours.`,
      suggestedAlternative: pickRandom(dict.alternatives, seed + 1),
      punchline: pickRandom(dict.punchlines, seed + 2),
    };
  } else {
    // Employer mode
    if (wasteRatio >= 0.60) {
      tier = 'catastrophic';
      stampText = 'OVERBILLED';
    } else if (wasteRatio >= 0.35) {
      tier = 'severe';
      stampText = 'DRAIN';
    } else if (wasteRatio >= 0.15) {
      tier = 'moderate';
      stampText = 'AUDIT';
    } else {
      tier = 'reasonable';
      stampText = 'APPROVED';
    }

    const dict = EMPLOYER_VERDICTS[tier];
    return {
      tier,
      stampText,
      headline: pickRandom(dict.headlines, seed),
      subhead: `Waste ratio: ${Math.round(wasteRatio * 100)}% of attendee payroll spent idling.`,
      suggestedAlternative: pickRandom(dict.alternatives, seed + 1),
      punchline: pickRandom(dict.punchlines, seed + 2),
    };
  }
}
