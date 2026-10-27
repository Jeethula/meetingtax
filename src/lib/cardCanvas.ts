import type { EmployeeResult, EmployerResult } from './calc';
import type { Verdict } from './verdict';
import { formatCurrency, formatMinutes, formatPercent } from './format';

export type ExportFormat = '1200x630' | '1080x1350' | '1080x1080';

export interface CardRenderOptions {
  mode: 'employee' | 'employer';
  employeeData?: EmployeeResult;
  employerData?: EmployerResult;
  verdict: Verdict;
  userName?: string;
  companyName?: string;
  receiptNumber?: string;
}

/**
 * Draws the high-impact Viral Statement Card on the FRONT face of the 3D card.
 * Features bold words alone ("I wasted X hours in unwanted meetings in which I could have completed Claude course...").
 */
export function drawReceiptFront(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: CardRenderOptions
): void {
  const { mode, employeeData, employerData, verdict, userName, companyName } = options;
  const receiptNo = options.receiptNumber || 'MT-004281';

  // 1. Fill thermal paper base
  ctx.save();
  ctx.fillStyle = '#F5EFEB';
  ctx.fillRect(0, 0, w, h);

  // Subtle paper grain/speckle
  ctx.fillStyle = 'rgba(0, 0, 0, 0.025)';
  for (let i = 0; i < 400; i++) {
    const rx = (Math.sin(i * 997) * 0.5 + 0.5) * w;
    const ry = (Math.cos(i * 331) * 0.5 + 0.5) * h;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // Draw jagged / perforated receipt ends
  drawPerforatedEdges(ctx, w, h);

  const pad = w * 0.08;
  const contentW = w - pad * 2;
  let y = h * 0.06;

  // Header: Organization & Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#111215';
  ctx.font = `800 ${Math.round(w * 0.052)}px 'JetBrains Mono', monospace`;
  ctx.fillText('MEETINGTAX · STATEMENT', w / 2, y);
  y += w * 0.038;

  ctx.fillStyle = '#636773';
  ctx.font = `600 ${Math.round(w * 0.027)}px 'JetBrains Mono', monospace`;
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).toUpperCase();
  ctx.fillText(`AUDIT #${receiptNo} · ${dateStr}`, w / 2, y);
  y += w * 0.035;

  // Header divider
  drawReceiptDivider(ctx, pad, y, contentW);
  y += w * 0.055;

  ctx.textAlign = 'left';

  if (mode === 'employee' && employeeData) {
    const hours = employeeData.hoursWastedPerYear;
    const workdays = employeeData.workdaysWastedPerYear;
    const displayName = userName?.trim() ? userName.trim() : 'ANONYMOUS ATTENDEE';

    // Tag
    ctx.fillStyle = '#FF3B1E';
    ctx.font = `700 ${Math.round(w * 0.024)}px 'JetBrains Mono', monospace`;
    ctx.fillText('// PERSONAL CALENDAR CONFESSION', pad, y);
    y += w * 0.065;

    // Big Bold Viral Statement Headline
    ctx.fillStyle = '#111215';
    ctx.font = `900 ${Math.round(w * 0.065)}px 'JetBrains Mono', monospace`;
    ctx.fillText('I WASTED', pad, y);
    y += w * 0.075;

    ctx.fillStyle = '#D92D20';
    ctx.font = `900 ${Math.round(w * 0.078)}px 'JetBrains Mono', monospace`;
    ctx.fillText(`${hours} HOURS`, pad, y);
    y += w * 0.072;

    ctx.fillStyle = '#111215';
    ctx.font = `800 ${Math.round(w * 0.044)}px 'JetBrains Mono', monospace`;
    ctx.fillText(`(${workdays} FULL WORKDAYS)`, pad, y);
    y += w * 0.058;

    ctx.fillStyle = '#111215';
    ctx.font = `800 ${Math.round(w * 0.052)}px 'JetBrains Mono', monospace`;
    ctx.fillText('IN UNWANTED MEETINGS.', pad, y);
    y += w * 0.052;

    drawReceiptDivider(ctx, pad, y, contentW);
    y += w * 0.048;

    // What could have been done
    ctx.fillStyle = '#545863';
    ctx.font = `700 ${Math.round(w * 0.025)}px 'JetBrains Mono', monospace`;
    ctx.fillText('TIME IN WHICH I COULD HAVE:', pad, y);
    y += w * 0.042;

    ctx.fillStyle = '#111215';
    ctx.font = `600 ${Math.round(w * 0.028)}px 'JetBrains Mono', monospace`;

    // Dynamic bullet points featuring Claude course, fitness, code shipping, reading
    const bulletList = [
      "• Completed Anthropic's Claude Prompting Course",
      "• Hit 150+ intense gym sessions & fitness PRs",
      "• Shipped full-stack engineering side projects",
      "• Read foundational system architecture books",
    ];

    bulletList.forEach((bullet) => {
      wrapText(ctx, bullet, pad + 6, y, contentW - 12, w * 0.038);
      y += w * 0.072;
    });

    y += w * 0.015;
    ctx.fillStyle = '#555866';
    ctx.font = `italic 600 ${Math.round(w * 0.031)}px 'Instrument Serif', Georgia, serif`;
    wrapText(ctx, '"Instead, I sat muted as an audience member."', pad + 6, y, contentW - 12, w * 0.04);
    y += w * 0.065;

    // Attribution
    ctx.textAlign = 'right';
    ctx.fillStyle = '#D92D20';
    ctx.font = `800 ${Math.round(w * 0.032)}px 'JetBrains Mono', monospace`;
    ctx.fillText(`— ${displayName.toUpperCase()}`, pad + contentW, y);
    ctx.textAlign = 'left';

  } else if (employerData) {
    const hours = employerData.annualHoursWasted;
    const displayOrg = companyName?.trim() ? companyName.trim() : 'OUR TEAM';

    ctx.fillStyle = '#FF3B1E';
    ctx.font = `700 ${Math.round(w * 0.024)}px 'JetBrains Mono', monospace`;
    ctx.fillText('// ORGANIZATIONAL CALENDAR AUDIT', pad, y);
    y += w * 0.065;

    ctx.fillStyle = '#111215';
    ctx.font = `900 ${Math.round(w * 0.065)}px 'JetBrains Mono', monospace`;
    ctx.fillText('OUR TEAM WASTED', pad, y);
    y += w * 0.075;

    ctx.fillStyle = '#D92D20';
    ctx.font = `900 ${Math.round(w * 0.078)}px 'JetBrains Mono', monospace`;
    ctx.fillText(`${hours} HOURS`, pad, y);
    y += w * 0.072;

    ctx.fillStyle = '#111215';
    ctx.font = `800 ${Math.round(w * 0.052)}px 'JetBrains Mono', monospace`;
    ctx.fillText('IN UNWANTED MEETINGS.', pad, y);
    y += w * 0.052;

    drawReceiptDivider(ctx, pad, y, contentW);
    y += w * 0.048;

    ctx.fillStyle = '#545863';
    ctx.font = `700 ${Math.round(w * 0.024)}px 'JetBrains Mono', monospace`;
    ctx.fillText('CALENDAR REALITY CHECK:', pad, y);
    y += w * 0.040;

    ctx.fillStyle = '#111215';
    ctx.font = `600 ${Math.round(w * 0.026)}px 'JetBrains Mono', monospace`;

    const neededCount = employerData ? employerData.needed : 3;
    const otherCount = employerData ? employerData.otherAttendees : 10;
    const employerBullets = [
      `• Only ${neededCount} core deciders actually needed for the sync`,
      `• Other ${otherCount} attendees only needed 15% (quick doubt / ping)`,
      "• Engineers could have built deep; business runs asynchronously",
      "• 85% of attendee time squandered in passive spectator mode",
    ];

    employerBullets.forEach((bullet) => {
      wrapText(ctx, bullet, pad + 6, y, contentW - 12, w * 0.036);
      y += w * 0.070;
    });

    y += w * 0.012;
    ctx.fillStyle = '#555866';
    ctx.font = `italic 600 ${Math.round(w * 0.030)}px 'Instrument Serif', Georgia, serif`;
    wrapText(ctx, '"Instead of quick pings for doubts, everyone sat as silent passengers."', pad + 6, y, contentW - 12, w * 0.038);
    y += w * 0.062;

    ctx.textAlign = 'right';
    ctx.fillStyle = '#D92D20';
    ctx.font = `800 ${Math.round(w * 0.032)}px 'JetBrains Mono', monospace`;
    ctx.fillText(`— ${displayOrg.toUpperCase()}`, pad + contentW, y);
    ctx.textAlign = 'left';
  }

  // Stamp: tilted rubber stamp
  drawRubberStamp(ctx, w * 0.65, h * 0.58, verdict.stampText, w);

  // Bottom prompt & Barcode
  const footerY = h * 0.88;
  drawReceiptDivider(ctx, pad, footerY, contentW);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#545863';
  ctx.font = `700 ${Math.round(w * 0.023)}px 'JetBrains Mono', monospace`;
  ctx.fillText('⟳ FLIP CARD TO VIEW ITEMIZED AUDIT BREAKDOWN', w / 2, footerY + w * 0.034);

  drawBarcode(ctx, pad, footerY + w * 0.05, contentW, w * 0.032);

  ctx.fillStyle = '#333642';
  ctx.font = `700 ${Math.round(w * 0.026)}px 'JetBrains Mono', monospace`;
  ctx.fillText('MEETINGTAX.APP · AUDIT YOUR CALENDAR', w / 2, footerY + w * 0.105);

  ctx.restore();
}

/**
 * Draws the verified Itemized Audit Ledger on the BACK face of the 3D card.
 * Revealed whenever the user flips the card!
 */
export function drawReceiptBack(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  options: CardRenderOptions
): void {
  const { mode, employeeData, employerData, verdict, userName, companyName } = options;
  const receiptNo = options.receiptNumber || 'MT-004281';

  // 1. Fill thermal paper base
  ctx.save();
  ctx.fillStyle = '#F5EFEB';
  ctx.fillRect(0, 0, w, h);

  // Subtle paper grain/speckle
  ctx.fillStyle = 'rgba(0, 0, 0, 0.025)';
  for (let i = 0; i < 400; i++) {
    const rx = (Math.sin(i * 997) * 0.5 + 0.5) * w;
    const ry = (Math.cos(i * 331) * 0.5 + 0.5) * h;
    ctx.fillRect(rx, ry, 2, 2);
  }

  // Perforated receipt edges
  drawPerforatedEdges(ctx, w, h);

  const pad = w * 0.08;
  const contentW = w - pad * 2;
  let y = h * 0.06;

  // Header: Organization & Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#111215';
  ctx.font = `800 ${Math.round(w * 0.052)}px 'JetBrains Mono', monospace`;
  ctx.fillText('MEETINGTAX · ITEMIZED LEDGER', w / 2, y);
  y += w * 0.038;

  ctx.fillStyle = '#636773';
  ctx.font = `600 ${Math.round(w * 0.027)}px 'JetBrains Mono', monospace`;
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).toUpperCase();
  ctx.fillText(`AUDIT #${receiptNo} · ${dateStr}`, w / 2, y);
  y += w * 0.035;

  drawReceiptDivider(ctx, pad, y, contentW);
  y += w * 0.045;

  ctx.textAlign = 'left';
  ctx.fillStyle = '#111215';
  ctx.font = `600 ${Math.round(w * 0.032)}px 'JetBrains Mono', monospace`;

  if (mode === 'employee' && employeeData) {
    const displayName = userName?.trim() ? userName.trim() : 'ANONYMOUS ATTENDEE';
    drawKeyValue(ctx, pad, contentW, y, 'ATTENDEE', displayName.toUpperCase(), w);
    y += w * 0.042;
    drawKeyValue(ctx, pad, contentW, y, 'MEETINGS / DAY', `${employeeData.meetingsPerDay} syncs`, w);
    y += w * 0.042;
    drawKeyValue(ctx, pad, contentW, y, 'AVG DURATION', `${employeeData.avgMinutes} min`, w);
    y += w * 0.042;
    drawKeyValue(ctx, pad, contentW, y, 'TRULY NEEDED', formatPercent(employeeData.neededPct), w);
    y += w * 0.045;

    drawReceiptDivider(ctx, pad, y, contentW);
    y += w * 0.05;

    // BIG WASTE NUMBERS
    drawKeyValue(ctx, pad, contentW, y, 'DAILY FLUSH', formatMinutes(employeeData.minutesWastedPerDay), w, true);
    y += w * 0.048;
    drawKeyValue(ctx, pad, contentW, y, 'YEARLY LOST', `${employeeData.hoursWastedPerYear} HRS`, w, true);
    y += w * 0.048;
    drawKeyValue(ctx, pad, contentW, y, 'FULL WORKDAYS', `${employeeData.workdaysWastedPerYear} DAYS`, w, true);
    y += w * 0.048;

    if (employeeData.moneyWastedPerYear !== null) {
      const formattedSalary = formatCurrency(employeeData.moneyWastedPerYear, employeeData.currency);
      drawKeyValue(ctx, pad, contentW, y, 'VALUE WASTED', formattedSalary, w, true, '#D92D20');
      y += w * 0.048;
    } else {
      drawKeyValue(ctx, pad, contentW, y, 'VALUE WASTED', 'TIME-ONLY (NO SALARY)', w, true, '#888E9E');
      y += w * 0.048;
    }

    drawReceiptDivider(ctx, pad, y, contentW);
    y += w * 0.045;

    // Opportunity cost translations
    ctx.fillStyle = '#545863';
    ctx.font = `700 ${Math.round(w * 0.024)}px 'JetBrains Mono', monospace`;
    ctx.fillText('IN THAT WASTED TIME YOU COULD HAVE:', pad, y);
    y += w * 0.035;

    ctx.fillStyle = '#111215';
    ctx.font = `500 ${Math.round(w * 0.026)}px 'JetBrains Mono', monospace`;
    employeeData.topOpportunities.slice(0, 4).forEach((opp) => {
      const bullet = `• ${opp.text}`;
      ctx.fillText(bullet.length > 37 ? bullet.slice(0, 36) + '…' : bullet, pad + 4, y);
      y += w * 0.033;
    });

  } else if (employerData) {
    const displayOrg = companyName?.trim() ? companyName.trim() : 'ORGANIZATIONAL SYNC';
    drawKeyValue(ctx, pad, contentW, y, 'TARGET SYNC', displayOrg.toUpperCase(), w);
    y += w * 0.042;
    drawKeyValue(ctx, pad, contentW, y, 'TOTAL ATTENDEES', `${employerData.attendees} people`, w);
    y += w * 0.038;
    drawKeyValue(ctx, pad, contentW, y, 'ACTUALLY NEEDED', `${employerData.needed} people`, w);
    y += w * 0.038;
    if (employerData.otherAttendees > 0) {
      drawKeyValue(ctx, pad, contentW, y, 'OTHER ATTENDEES', `${employerData.otherAttendees} (15% act/85% idle)`, w);
      y += w * 0.038;
    }
    drawKeyValue(ctx, pad, contentW, y, 'FREQUENCY', employerData.frequency.toUpperCase(), w);
    y += w * 0.042;

    drawReceiptDivider(ctx, pad, y, contentW);
    y += w * 0.05;

    // Waste metrics
    const singleCostFormatted = formatCurrency(employerData.singleMeetingTotalCost, employerData.currency);
    drawKeyValue(ctx, pad, contentW, y, 'COST / MEETING', singleCostFormatted, w);
    y += w * 0.048;

    const singleWasteFormatted = formatCurrency(employerData.singleMeetingWastedCost, employerData.currency);
    drawKeyValue(ctx, pad, contentW, y, 'WASTE / MEETING', singleWasteFormatted, w, true);
    y += w * 0.048;

    const annualWasteFormatted = formatCurrency(employerData.annualWastedCost, employerData.currency);
    drawKeyValue(ctx, pad, contentW, y, 'ANNUALIZED WASTE', annualWasteFormatted, w, true, '#D92D20');
    y += w * 0.048;

    drawKeyValue(ctx, pad, contentW, y, 'HOURS SQUANDERED', `${employerData.annualHoursWasted} HRS`, w, true);
    y += w * 0.048;

    drawReceiptDivider(ctx, pad, y, contentW);
    y += w * 0.045;

    ctx.fillStyle = '#545863';
    ctx.font = `700 ${Math.round(w * 0.026)}px 'JetBrains Mono', monospace`;
    ctx.fillText('ANNUAL EQUIVALENTS (ILLUSTRATIVE):', pad, y);
    y += w * 0.04;

    ctx.fillStyle = '#111215';
    ctx.font = `500 ${Math.round(w * 0.029)}px 'JetBrains Mono', monospace`;
    employerData.equivalents.slice(0, 2).forEach((eq) => {
      const line = `• ${eq.text}`;
      ctx.fillText(line.length > 34 ? line.slice(0, 33) + '…' : line, pad + 4, y);
      y += w * 0.04;
    });
  }

  // Verdict section
  y = Math.max(y + w * 0.02, h * 0.73);
  drawReceiptDivider(ctx, pad, y, contentW);
  y += w * 0.045;

  ctx.fillStyle = '#545863';
  ctx.font = `700 ${Math.round(w * 0.026)}px 'JetBrains Mono', monospace`;
  ctx.fillText('OFFICIAL VERDICT:', pad, y);
  y += w * 0.038;

  ctx.fillStyle = '#111215';
  ctx.font = `italic 700 ${Math.round(w * 0.033)}px 'Instrument Serif', Georgia, serif`;
  wrapText(ctx, `"${verdict.headline}"`, pad, y, contentW, w * 0.042);

  // Bottom stamp box
  drawRubberStamp(ctx, w * 0.68, h * 0.50, verdict.stampText, w);

  // Footer: barcode and URL
  const footerY = h * 0.91;
  drawBarcode(ctx, pad, footerY, contentW, w * 0.035);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#333642';
  ctx.font = `700 ${Math.round(w * 0.028)}px 'JetBrains Mono', monospace`;
  ctx.fillText('MEETINGTAX.APP · AUDIT YOUR CALENDAR', w / 2, footerY + w * 0.065);

  ctx.restore();
}

/**
 * Helper to draw perforated edges at top and bottom of receipt
 */
function drawPerforatedEdges(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  const toothWidth = 14;
  const toothHeight = 7;
  ctx.fillStyle = '#090A0C'; // matches dark canvas background outside receipt

  // Top teeth
  ctx.beginPath();
  for (let x = 0; x < w; x += toothWidth) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + toothWidth / 2, toothHeight);
    ctx.lineTo(x + toothWidth, 0);
  }
  ctx.closePath();
  ctx.fill();

  // Bottom teeth
  ctx.beginPath();
  for (let x = 0; x < w; x += toothWidth) {
    ctx.moveTo(x, h);
    ctx.lineTo(x + toothWidth / 2, h - toothHeight);
    ctx.lineTo(x + toothWidth, h);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Helper to draw clean receipt dashed line
 */
function drawReceiptDivider(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw tabular key value with dot leaders (e.g. "MEETINGS/DAY .......... 5")
 */
function drawKeyValue(
  ctx: CanvasRenderingContext2D,
  x: number,
  w: number,
  y: number,
  key: string,
  val: string,
  canvasW: number,
  bold = false,
  highlightColor?: string
): void {
  ctx.save();
  ctx.fillStyle = bold ? '#111215' : '#454955';
  ctx.font = `${bold ? '700' : '500'} ${Math.round(canvasW * 0.028)}px 'JetBrains Mono', monospace`;
  ctx.textAlign = 'left';
  ctx.fillText(key, x, y);

  const keyWidth = ctx.measureText(key).width;
  ctx.textAlign = 'right';
  ctx.fillStyle = highlightColor || (bold ? '#111215' : '#222329');
  ctx.font = `${bold ? '800' : '600'} ${Math.round(canvasW * 0.03)}px 'JetBrains Mono', monospace`;
  ctx.fillText(val, x + w, y);

  const valWidth = ctx.measureText(val).width;
  const dotStartX = x + keyWidth + 8;
  const dotEndX = x + w - valWidth - 8;

  if (dotEndX > dotStartX) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.font = `400 ${Math.round(canvasW * 0.022)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'left';
    let dots = '';
    const dotCharWidth = ctx.measureText('.').width;
    const count = Math.floor((dotEndX - dotStartX) / dotCharWidth);
    for (let i = 0; i < count; i++) dots += '.';
    ctx.fillText(dots, dotStartX, y);
    ctx.restore();
  }
  ctx.restore();
}

/**
 * Draws the rubber stamp over the receipt
 */
function drawRubberStamp(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  w: number
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.16); // ~9 degrees tilt

  const fontSize = Math.round(w * 0.055);
  ctx.font = `900 ${fontSize}px 'JetBrains Mono', monospace`;
  const textMetrics = ctx.measureText(text);
  const stampW = textMetrics.width + w * 0.08;
  const stampH = fontSize * 1.55;

  ctx.strokeStyle = '#D92D20';
  ctx.fillStyle = 'rgba(217, 45, 32, 0.12)';
  ctx.lineWidth = Math.max(3, w * 0.007);

  // Outer border with ink bleed
  ctx.strokeRect(-stampW / 2, -stampH / 2, stampW, stampH);
  ctx.fillRect(-stampW / 2, -stampH / 2, stampW, stampH);

  // Inner border
  ctx.lineWidth = Math.max(1, w * 0.002);
  ctx.strokeRect(-stampW / 2 + 3, -stampH / 2 + 3, stampW - 6, stampH - 6);

  // Text
  ctx.fillStyle = '#D92D20';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 1);

  ctx.restore();
}

/**
 * Helper to draw barcode lines
 */
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.save();
  ctx.fillStyle = '#111215';
  let curX = x;
  let seed = 42;
  while (curX < x + w) {
    seed = (seed * 9301 + 49297) % 233280;
    const barWidth = 1.5 + (seed % 4);
    seed = (seed * 9301 + 49297) % 233280;
    const gap = 1 + (seed % 3);
    ctx.fillRect(curX, y, barWidth, h);
    curX += barWidth + gap;
  }
  ctx.restore();
}



/**
 * Wrap text cleanly on canvas
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): void {
  const words = text.split(' ');
  let line = '';
  let curY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, curY);
      line = words[n] + ' ';
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, curY);
}

/**
 * High-DPI Export Generator for PNG download:
 * Supports:
 * - 1200x630 (X/LinkedIn landscape banner)
 * - 1080x1350 (IG/LinkedIn vertical feed portrait)
 * - 1080x1080 (1:1 square)
 */
export async function renderExportCard(
  format: ExportFormat,
  options: CardRenderOptions,
  side: 'front' | 'back' = 'front'
): Promise<string> {
  const [targetW, targetH] = format === '1200x630'
    ? [1200, 630]
    : format === '1080x1350'
    ? [1080, 1350]
    : [1080, 1080];

  const canvas = document.createElement('canvas');
  // Render at 2x crisp DPI
  const scale = 2;
  canvas.width = targetW * scale;
  canvas.height = targetH * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');
  ctx.scale(scale, scale);

  // 1. Draw rich background
  ctx.fillStyle = '#090A0C';
  ctx.fillRect(0, 0, targetW, targetH);

  // Subtle dark grid pattern on background
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let gx = 0; gx < targetW; gx += gridSize) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, targetH);
    ctx.stroke();
  }
  for (let gy = 0; gy < targetH; gy += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(targetW, gy);
    ctx.stroke();
  }

  // Radial soft glow behind the receipt
  const glow = ctx.createRadialGradient(
    targetW / 2,
    targetH / 2,
    50,
    targetW / 2,
    targetH / 2,
    targetW * 0.45
  );
  glow.addColorStop(0, 'rgba(255, 59, 30, 0.08)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, targetW, targetH);

  // 2. Compute receipt dimensions and position
  let receiptW: number;
  let receiptH: number;

  if (format === '1200x630') {
    receiptH = targetH * 0.88;
    receiptW = receiptH * 0.62;
  } else if (format === '1080x1350') {
    receiptW = targetW * 0.72;
    receiptH = receiptW * 1.58;
  } else {
    // 1080x1080
    receiptH = targetH * 0.84;
    receiptW = receiptH * 0.64;
  }

  const receiptX = (targetW - receiptW) / 2;
  const receiptY = (targetH - receiptH) / 2;

  // Drop shadow for the physical card
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 45;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 20;

  // Render receipt onto an offscreen canvas
  const receiptCanvas = document.createElement('canvas');
  receiptCanvas.width = receiptW * scale;
  receiptCanvas.height = receiptH * scale;
  const rCtx = receiptCanvas.getContext('2d');
  if (rCtx) {
    rCtx.scale(scale, scale);
    if (side === 'back') {
      drawReceiptBack(rCtx, receiptW, receiptH, options);
    } else {
      drawReceiptFront(rCtx, receiptW, receiptH, options);
    }
  }

  ctx.drawImage(receiptCanvas, receiptX, receiptY, receiptW, receiptH);
  ctx.restore();

  // Branding watermark in corner
  ctx.fillStyle = '#636773';
  ctx.font = "700 13px 'JetBrains Mono', monospace";
  ctx.textAlign = 'right';
  ctx.fillText('MEETINGTAX.APP', targetW - 32, targetH - 24);

  return canvas.toDataURL('image/png');
}
