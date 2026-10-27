import React, { useState } from 'react';
import type { CardRenderOptions, ExportFormat } from '../lib/cardCanvas';
import { renderExportCard } from '../lib/cardCanvas';
import {
  encodeShareParams,
  buildSocialShareCopy,
  openTwitterShare,
  openLinkedInShare,
} from '../lib/share';
import type { EmployeeInputs, EmployerInputs } from '../lib/calc';
import { track } from '../lib/analytics';
import {
  Download,
  Copy,
  Check,
  Lock,
  Unlock,
} from 'lucide-react';

interface ShareBarProps {
  mode: 'employee' | 'employer';
  options: CardRenderOptions;
  employeeInputs: EmployeeInputs;
  employerInputs: EmployerInputs;
  hoursOrAttendees: number;
  workdaysOrCostString: string;
}

export const ShareBar: React.FC<ShareBarProps> = ({
  mode,
  options,
  employeeInputs,
  employerInputs,
  hoursOrAttendees,
  workdaysOrCostString,
}) => {
  const [includeSalaryInUrl, setIncludeSalaryInUrl] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('1200x630');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Generate shareable URL
  const query = encodeShareParams(mode, employeeInputs, employerInputs, includeSalaryInUrl);
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?${query}`
    : `https://meetingtax.app/?${query}`;

  const { twitterText, linkedinText } = buildSocialShareCopy(
    mode,
    hoursOrAttendees,
    workdaysOrCostString,
    shareUrl
  );

  // Download high-DPI crisp PNG
  const handleDownloadPng = async (fmt = selectedFormat) => {
    try {
      setIsExporting(true);
      track('download_clicked', { format: fmt, mode });
      const dataUrl = await renderExportCard(fmt, options, 'front');

      // Check for mobile Web Share API with File capability
      if (
        typeof navigator !== 'undefined' &&
        navigator.canShare &&
        navigator.share
      ) {
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], `meetingtax-statement-${fmt}.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: 'My MeetingTax Statement',
              text: twitterText,
            });
            setIsExporting(false);
            return;
          }
        } catch {
          // fallback to regular download below
        }
      }

      // Desktop download fallback
      const link = document.createElement('a');
      link.download = `meetingtax-statement-${fmt}-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('PNG export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Share to X with image handling
  const handleShareToX = async () => {
    track('share_clicked', { platform: 'twitter' });
    try {
      setIsExporting(true);
      const dataUrl = await renderExportCard(selectedFormat, options, 'front');
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `meetingtax-statement-${selectedFormat}.png`, { type: 'image/png' });

      // Native share if supported (mobile / Safari)
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'My MeetingTax Statement',
            text: twitterText,
            url: shareUrl,
            files: [file],
          });
          setIsExporting(false);
          return;
        } catch {
          // fall through
        }
      }

      // Copy image to clipboard for instant Cmd+V paste into tweet
      if (typeof navigator !== 'undefined' && navigator.clipboard && (window as any).ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new (window as any).ClipboardItem({ 'image/png': blob }),
          ]);
        } catch {
          // ignore clipboard image error
        }
      }

      // Download image file directly
      const link = document.createElement('a');
      link.download = `meetingtax-statement-${selectedFormat}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setShareToast('Card image copied & downloaded! In X, press Cmd+V / Ctrl+V to attach your image.');
      setTimeout(() => setShareToast(null), 5000);

      // Open Twitter intent
      openTwitterShare(twitterText, shareUrl);
    } catch (err) {
      console.error('Share to X error', err);
      openTwitterShare(twitterText, shareUrl);
    } finally {
      setIsExporting(false);
    }
  };

  // Share to LinkedIn with image download & clipboard caption
  const handleShareToLinkedIn = async () => {
    track('share_clicked', { platform: 'linkedin' });
    try {
      setIsExporting(true);
      const dataUrl = await renderExportCard(selectedFormat, options, 'front');
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `meetingtax-statement-${selectedFormat}.png`, { type: 'image/png' });

      // Native share if supported
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: 'My MeetingTax Statement',
            text: linkedinText,
            url: shareUrl,
            files: [file],
          });
          setIsExporting(false);
          return;
        } catch {
          // fall through
        }
      }

      // Automatically copy the rich LinkedIn caption to clipboard
      await navigator.clipboard.writeText(linkedinText);

      // Download the card image so the user can easily attach it
      const link = document.createElement('a');
      link.download = `meetingtax-statement-${selectedFormat}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setShareToast('Caption copied & card image downloaded! On LinkedIn, press Cmd+V to paste the text and attach the card image.');
      setTimeout(() => setShareToast(null), 6000);

      openLinkedInShare(shareUrl);
    } catch (err) {
      console.error('Share to LinkedIn error', err);
      openLinkedInShare(shareUrl);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      track('share_clicked', { type: 'copy_link' });
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // ignore
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(linkedinText);
      setCopiedCaption(true);
      track('share_clicked', { type: 'copy_caption' });
      setTimeout(() => setCopiedCaption(false), 2200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-[#121316] border border-[#262830] rounded-xl p-4 sm:p-5 space-y-3.5 shadow-xl w-full">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#21232A] pb-3">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF3B1E] font-bold block">
            BROADCAST AUDIT
          </span>
          <h3 className="font-headline text-base sm:text-lg font-bold text-[#F5EFEB]">
            Share Your Receipt
          </h3>
        </div>

        {/* Privacy toggle for share URL */}
        <button
          type="button"
          onClick={() => setIncludeSalaryInUrl(!includeSalaryInUrl)}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#18191E] border border-[#2B2E38] text-[11px] font-mono text-[#888E9E] hover:text-[#EAECEF] transition-colors cursor-pointer"
          title="Toggle whether salary amount is encoded in the share URL"
        >
          {includeSalaryInUrl ? (
            <>
              <Unlock className="w-3 h-3 text-[#FF3B1E]" />
              <span>Salary visible in link</span>
            </>
          ) : (
            <>
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Salary masked (Safe)</span>
            </>
          )}
        </button>
      </div>

      {/* Share Toast Banner */}
      {shareToast && (
        <div className="bg-[#1F140E] border border-[#FF3B1E]/60 text-[#FFD6CE] p-3 rounded-lg font-mono text-xs flex items-center space-x-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-[#FF3B1E] flex-shrink-0" />
          <span className="leading-snug">{shareToast}</span>
        </div>
      )}

      {/* Format Selector for PNG Download */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block font-mono text-[10px] text-[#888E9E] uppercase tracking-wider">
            Export Resolution
          </label>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              { id: '1200x630', label: '1200×630', sub: 'X / LinkedIn' },
              { id: '1080x1350', label: '1080×1350', sub: 'Portrait' },
              { id: '1080x1080', label: '1080×1080', sub: 'Square' },
            ] as const
          ).map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              onClick={() => setSelectedFormat(fmt.id)}
              className={`py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                selectedFormat === fmt.id
                  ? 'bg-[#1D1E24] border-[#FF3B1E] text-[#F5EFEB]'
                  : 'bg-[#18191E] border-[#262830] text-[#888E9E] hover:border-[#333642]'
              }`}
            >
              <div className="font-mono text-[11px] font-bold">{fmt.label}</div>
              <div className="text-[9px] text-[#888E9E] truncate">{fmt.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Download CTA */}
      <button
        type="button"
        disabled={isExporting}
        onClick={() => handleDownloadPng()}
        className="w-full py-2.5 bg-[#F5EFEB] hover:bg-[#FAF7F2] text-[#111215] font-mono font-extrabold text-xs tracking-wider uppercase rounded-lg shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isExporting ? 'Rendering Crisp 2× PNG…' : `Download Crisp PNG (${selectedFormat})`}</span>
      </button>

      {/* One-Tap Social Share Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {/* Share on X */}
        <button
          type="button"
          onClick={handleShareToX}
          className="py-2 px-3 bg-[#18191E] hover:bg-[#20222A] border border-[#2B2E38] rounded-lg font-mono text-xs text-[#EAECEF] font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>Share to X</span>
        </button>

        {/* Share on LinkedIn */}
        <button
          type="button"
          onClick={handleShareToLinkedIn}
          className="py-2 px-3 bg-[#18191E] hover:bg-[#20222A] border border-[#2B2E38] rounded-lg font-mono text-xs text-[#EAECEF] font-semibold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
          </svg>
          <span>Share to LinkedIn</span>
        </button>
      </div>

      {/* Fast Copy Buttons */}
      <div className="flex items-center gap-2 pt-1 border-t border-[#21232A]/70 text-[11px] font-mono">
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#18191E] hover:bg-[#22242C] text-[#B8BCC8] hover:text-[#EAECEF] transition-colors cursor-pointer border border-[#262830]"
        >
          {copiedLink ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyCaption}
          className="flex-1 flex items-center justify-center space-x-1 px-2.5 py-1.5 rounded-lg bg-[#18191E] hover:bg-[#22242C] text-[#B8BCC8] hover:text-[#EAECEF] transition-colors cursor-pointer border border-[#262830]"
        >
          {copiedCaption ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copiedCaption ? 'Caption Copied!' : 'Copy Caption'}</span>
        </button>
      </div>
    </div>
  );
};
