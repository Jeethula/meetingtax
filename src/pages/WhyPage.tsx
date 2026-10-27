import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Clock, Flame } from 'lucide-react';


export const WhyPage: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 bg-[#17181D] border border-[#333642] px-3.5 py-1.5 rounded-full mb-6">
          <Terminal className="w-3.5 h-3.5 text-[#FF3B1E]" />
          <span className="font-mono text-xs font-semibold tracking-wider text-[#D0D4DD] uppercase">
            Origin Story // Why I Built This
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-headline text-[#FAF7F2] leading-tight mb-6">
          Confessions of a Technical Guy Trapped in Business Meetings.
        </h1>

        <p className="font-mono text-sm text-[#FF3B1E] uppercase tracking-wider">
          Why I built MeetingTax — and why calendar inflation is burning both developers and employers.
        </p>
      </div>

      {/* Main Narrative Article */}
      <article className="space-y-8 text-base sm:text-lg text-[#C8CCD6] leading-relaxed border-t border-b border-[#21232A] py-10">
        <p>
          I have always been a technical guy. My joy comes from deep focus: designing clean systems, writing reliable code, debugging thorny concurrency bugs, and actually shipping things that work.
        </p>

        <p>
          In almost every company I worked at, a bizarre corporate ritual unfolded every single day. An invite would land on my calendar: <em>"Sprint Alignment & Sync"</em>, <em>"Requirements Breakdown"</em>, or <em>"Weekly Status"</em>.
        </p>

        <blockquote className="border-l-2 border-[#FF3B1E] pl-6 py-2 my-6 font-mono text-sm sm:text-base text-[#F5EFEB] bg-[#121316] rounded-r-xl">
          "The Product Owner, Business Analyst, and business stakeholders would talk in circles for 45 minutes debating wording or business edge-cases. I sat there in silence. I only needed to speak for 90 seconds to say: <span className="text-[#FF3B1E]">'Yes, that endpoint supports it'</span>."
        </blockquote>

        <p>
          At first, I thought I could outsmart it. I muted my microphone, minimized the meeting window, and opened my IDE on another monitor to write code or read documentation while they talked.
        </p>

        <p>
          <strong>Except you can’t actually do deep engineering work with human voices buzzing in your headphones.</strong>
        </p>

        <p>
          You’re half-listening in case someone says your name. You can’t solve complex algorithms. You end up reading Hacker News, tweaking CSS margins, or doing shallow busywork. Your mental battery drains, but you produced almost nothing.
        </p>

        {/* The "Business Alignment" Fallacy & What Engineers Actually Need */}
        <div className="bg-[#121316] border border-[#262830] rounded-xl p-6 sm:p-7 space-y-4 my-8">
          <div className="font-mono text-xs uppercase tracking-wider text-[#FF3B1E] font-bold">
            The Alignment Argument // What Builders Actually Need
          </div>
          <h2 className="font-headline text-xl sm:text-2xl font-bold text-[#FAF7F2]">
            "Understanding the business is important — but not like this."
          </h2>
          <p className="text-sm sm:text-base text-[#C8CCD6] leading-relaxed">
            People will always argue: <em>"Engineers need to be in the room so they understand the business!"</em>
          </p>
          <p className="text-sm sm:text-base text-[#C8CCD6] leading-relaxed">
            Yes, in <strong>some cases</strong>, high-level business context matters. If a decision changes system architecture or product direction, of course engineers should be consulted.
          </p>
          <p className="text-sm sm:text-base text-[#C8CCD6] leading-relaxed">
            But in <strong>many cases</strong>, I am not involved in those decisions at all. I don’t need to care about someone else's daily task, another team’s internal workflow, or a 40-minute back-and-forth between business stakeholders that has zero overlap with what I build. Dragging developers into those rooms doesn't create alignment — it creates hostages.
          </p>
          <p className="text-sm sm:text-base text-[#F5EFEB] leading-relaxed font-semibold">
            What I actually need isn’t to sit through other people’s discussions. <span className="text-[#FF3B1E]">I just need the requirement.</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#18191E] border border-[#2B2E38] rounded-lg p-4 font-mono text-xs space-y-1.5">
              <span className="text-[#FF3B1E] font-bold uppercase tracking-wider">✕ What Usually Happens</span>
              <p className="text-[#888E9E] leading-relaxed">
                Sitting through 50 minutes of someone else’s tasks, stakeholder negotiations, and operational minutiae just to answer one technical question.
              </p>
            </div>
            <div className="bg-[#18191E] border border-[#2B2E38] rounded-lg p-4 font-mono text-xs space-y-1.5">
              <span className="text-[#2EE59D] font-bold uppercase tracking-wider">✓ What Is Actually Needed</span>
              <p className="text-[#888E9E] leading-relaxed">
                Clear requirements, documented edge cases, and 3 minutes to confirm technical feasibility — leaving uninterrupted time to actually build.
              </p>
            </div>
          </div>

          {/* Real-world team dynamics: 3 needed vs 10 spectators */}
          <div className="bg-[#18191E] border border-[#2B2E38] rounded-lg p-5 font-mono text-xs space-y-3 mt-4">
            <span className="text-[#FF3B1E] font-bold uppercase tracking-wider block">
              The Reality: 3 Core Deciders vs. 10 Passive Spectators
            </span>
            <p className="text-[#C8CCD6] leading-relaxed">
              In a typical 13-person team sync, <strong>only 3 people are actually needed</strong> to debate and make the call. The remaining 10 attendees are only needed for maybe <strong>15% of the time</strong> — answering a single doubt or giving a 60-second status check.
            </p>
            <p className="text-[#C8CCD6] leading-relaxed">
              If someone has a doubt or needs clarity, they could have just <strong>pinged on Slack or jumped on a 2-minute call</strong>. That way, the engineer stays in deep code flow, and the business person can run the business — instead of burning 85% of their meeting time waiting in silence.
            </p>
          </div>

          {/* Combined AI Role Reality */}
          <div className="bg-[#18191E] border border-[#2B2E38] rounded-lg p-5 font-mono text-xs space-y-3 mt-4">
            <span className="text-emerald-400 font-bold uppercase tracking-wider block">
              The AI Combined-Role Fallacy: Great in Async, Catastrophic in Meetings
            </span>
            <p className="text-[#C8CCD6] leading-relaxed">
              With AI tools, combining technical depth with business understanding is increasingly possible. Having a lean team or fewer resources who can understand both tech and business is powerful.
            </p>
            <p className="text-[#C8CCD6] leading-relaxed">
              <strong>But dragging that same resource into endless synchronized meetings causes massive hourly wastage.</strong> If high-value resources can do both asynchronously, it works. But forcing them to sit through live meetings means you are paying premium hourly rates for them to sit idle while someone else debates edge cases.
            </p>
          </div>
        </div>

        {/* The Two Sides of the Loss */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="bg-[#121316] border border-[#262830] rounded-xl p-6">
            <div className="flex items-center space-x-2 text-[#FF3B1E] font-mono text-xs font-bold uppercase mb-2">
              <Clock className="w-4 h-4" />
              <span>For The Developer / Employee</span>
            </div>
            <p className="text-sm text-[#888E9E] leading-relaxed">
              Your finite lifespan and career growth get stolen. In those 300+ wasted hours each year, you could have learned Rust, mastered Anthropic's Claude prompting courses, shipped 5 side project MVPs, or gone to the gym 150 times.
            </p>
          </div>

          <div className="bg-[#121316] border border-[#262830] rounded-xl p-6">
            <div className="flex items-center space-x-2 text-[#FF3B1E] font-mono text-xs font-bold uppercase mb-2">
              <Flame className="w-4 h-4" />
              <span>For The Employer Paying The Bill</span>
            </div>
            <p className="text-sm text-[#888E9E] leading-relaxed">
              Companies complain about engineering velocity, yet they routinely pay ₹25,00,000+ / $140,000+ developer salaries just to have them sit as mute audience members in business discussions. That’s pure payroll burn.
            </p>
          </div>
        </div>

        <p>
          The problem isn’t that meetings are evil. Quick decisions between the 2 people who actually decide are great. The problem is <strong>calendar laziness</strong>: inviting 8 people when 2 would do, because typing an async memo requires effort, while hitting "Invite All" on Google Calendar takes 2 seconds.
        </p>

        <p>
          I built <strong>MeetingTax</strong> because numbers speak louder than complaints. When you see your wasted hours translated into real salary, lost side projects, missed gym sessions, and a stamped receipt you can show your team, the waste becomes impossible to ignore.
        </p>
      </article>

      {/* Footer CTA */}
      <div className="bg-[#121316] border border-[#262830] rounded-2xl p-8 sm:p-10 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-headline text-[#FAF7F2]">
          Ready to see what your calendar is actually costing?
        </h2>
        <p className="text-sm font-mono text-[#888E9E] max-w-lg mx-auto">
          Take 60 seconds to answer 5 honest questions. Get your stamped 3D receipt card.
        </p>
        <Link
          to="/audit"
          className="inline-flex items-center space-x-2 px-8 py-4 bg-[#FF3B1E] hover:bg-[#E62E12] text-white font-mono font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl hover:shadow-[#FF3B1E]/20"
        >
          <span>Calculate My Meeting Tax</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
