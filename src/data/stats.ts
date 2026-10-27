export interface StatItem {
  id: string;
  value: string;
  unit?: string;
  claim: string;
  context: string;
  source: string;
  url: string;
  verified: boolean;
  isIllustration?: boolean;
}

export const STATS: StatItem[] = [
  {
    id: 'stat-hbr-unproductive',
    value: '71%',
    claim: 'of senior managers say meetings are unproductive and inefficient.',
    context: 'Survey of 182 senior managers across diverse industries found meetings actively prevent workers from completing deep focus work.',
    source: 'Harvard Business Review (Leslie A. Perlow et al., "Stop the Meeting Madness", 2017)',
    url: 'https://hbr.org/2017/07/stop-the-meeting-madness',
    verified: true,
  },
  {
    id: 'stat-msft-disruptor',
    value: '#1',
    claim: 'Productivity disruptor cited by employees is "inefficient meetings".',
    context: 'Data across billions of Microsoft 365 signals showed meeting time has increased 3x since 2020, with 68% reporting a lack of uninterrupted focus blocks.',
    source: 'Microsoft Work Trend Index Annual Report (2023)',
    url: 'https://www.microsoft.com/en-us/worklab/work-trend-index/will-ai-fix-work',
    verified: true,
  },
  {
    id: 'stat-room-illustration',
    value: '2 of 8',
    claim: 'Only 2 people usually decide. The other 6 are just burning clock.',
    context: 'In an average 8-person sync, two leads discuss while everyone else checks email, waits to speak, or wonders why this wasn’t an async memo.',
    source: 'MeetingTax Interactive Observation (Rhetorical Illustration)',
    url: '#calculator',
    verified: true,
    isIllustration: true,
  },
  {
    id: 'stat-bain-exec-hours',
    value: '23 hrs',
    unit: '/week',
    claim: 'Average executive meeting time per week — up from 10 hours in the 1960s.',
    context: 'Bain & Company analysis of corporate calendaring found that a single weekly executive committee meeting directly triggered 300,000 hours of preparatory meetings throughout the organization.',
    source: 'Bain & Company ("Where Did the Time Go? A Study in Organizational Time", Michael Mankins)',
    url: 'https://www.bain.com/insights/where-did-the-time-go-infographic/',
    verified: true,
  },
  {
    id: 'stat-atlassian-waste',
    value: '50%',
    claim: 'of meeting time is rated completely wasted by attendees.',
    context: 'With employees averaging ~62 meetings per month, approximately 31 hours per month are spent in passive, ineffective calendar clutter.',
    source: 'Atlassian Workplace Research ("You Waste A Lot Of Time At Work")',
    url: 'https://www.atlassian.com/time-wasted-at-work',
    verified: true,
  },
];
