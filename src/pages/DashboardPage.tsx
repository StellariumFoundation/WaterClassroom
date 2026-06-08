import { useApp } from "../contexts/AppContext";
import { Award, Flame, CheckCircle, Shield, Sparkles, Cpu, Building, Compass, Lock, Check } from "lucide-react";
import { BADGES } from "../lessonsData";

export default function DashboardPage() {
  const {
    progress, isUserActivated, loginEmail, onboardingCurriculum, verifiedExamsList,
    landingAuthRole, studentBillingCycle, setStudentBillingCycle
  } = useApp();

  if (!isUserActivated) {
    const isYearly = studentBillingCycle === "yearly";
    const pricingLabel = landingAuthRole === "water-student" ? (isYearly ? "$190" : "$19") :
      landingAuthRole === "independent-student" ? (isYearly ? "$150" : "$15") : (isYearly ? "$120" : "$12");
    const planLabel = landingAuthRole === "water-student" ? "Water School" :
      landingAuthRole === "independent-student" ? "Independent" : "School Student";

    return (
      <div className="p-8 text-center bg-slate-950 rounded-xl border border-blue-800 animate-fade-in shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Activate Account to Proceed</h2>
        <p className="text-slate-400 mb-6 max-w-lg mx-auto">Your account is created. Activate your {planLabel} plan now to unlock full access to the Water Classroom.</p>
        
        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-2 bg-slate-900/60 p-1 rounded-xl border border-slate-800 max-w-[220px] mx-auto mb-6">
          <button onClick={() => setStudentBillingCycle("monthly")}
            className={`px-4 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition ${studentBillingCycle === "monthly" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
          >Monthly</button>
          <button onClick={() => setStudentBillingCycle("yearly")}
            className={`px-4 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider transition ${studentBillingCycle === "yearly" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
          >Yearly <span className="text-emerald-400 text-[8px]">Save 17%</span></button>
        </div>

        <button
          onClick={async () => {
            const response = await fetch("/api/create-checkout-session", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: loginEmail, type: landingAuthRole, billingCycle: studentBillingCycle })
            });
            const data = await response.json();
            if (data.url) window.location.href = data.url;
            else alert(data.error || "Failed to create checkout.");
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold transition shadow-lg shadow-blue-600/20"
        >
          Purchase Activation ({pricingLabel} / {isYearly ? "yr" : "mo"})
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Level Rank Card */}
      <div className="frosted-glass rounded-3xl p-6 sm:p-8 border border-blue-950 flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
        <div className="space-y-4 w-full sm:w-1/2">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-blue-400 font-bold block">Student Profile Register</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none uppercase">Active Sovereign Student</h2>
            <span className="text-[10px] text-slate-400 block mt-1 tracking-wide">CURRICULUM: {onboardingCurriculum}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>XP Tracker to Level {progress.level + 1}</span>
              <span>{progress.points} / {Math.pow(progress.level, 2) * 100 + 300} XP</span>
            </div>
            <div className="w-full bg-[#050b18] h-2.5 rounded-full overflow-hidden border border-blue-950/80">
              <div className="blue-gradient-bg h-full transition-all duration-500 shadow-[0_0_8px_#3b82f6]"
                style={{ width: `${Math.min(100, (progress.points / (Math.pow(progress.level, 2) * 100 + 300)) * 100)}%` }} />
            </div>
          </div>
        </div>
        <div className="flex gap-4 sm:gap-6 w-full sm:w-auto shrink-0 justify-around sm:justify-start">
          <div className="text-center bg-slate-950 p-4 rounded-2xl border border-blue-900/30 min-w-24 sm:min-w-28 shadow-inner">
            <Award className="w-5 h-5 text-blue-400 mx-auto mb-1.5 animate-bounce" />
            <strong className="text-xl sm:text-2xl font-extrabold block text-white">{progress.level}</strong>
            <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Class Rank</span>
          </div>
          <div className="text-center bg-slate-950 p-4 rounded-2xl border border-blue-900/30 min-w-24 sm:min-w-28 shadow-inner">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-400 mx-auto mb-1.5" />
            <strong className="text-xl sm:text-2xl font-extrabold block text-white">{progress.streakDays}</strong>
            <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Day Streak</span>
          </div>
          <div className="text-center bg-slate-950 p-4 rounded-2xl border border-blue-900/30 min-w-24 sm:min-w-28 shadow-inner">
            <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
            <strong className="text-xl sm:text-2xl font-extrabold block text-white">{progress.completedLessons.length}</strong>
            <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">Passed Tests</span>
          </div>
        </div>
      </div>

      {/* Certificates & Study Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="frosted-glass rounded-3xl p-6 border border-blue-950 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">VERIFIED PROCTOR CERTIFICATES</h3>
            <p className="text-xs text-slate-400">Verified proctored exam transcripts recorded onto the Water Classroom registry.</p>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {verifiedExamsList.length > 0 ? verifiedExamsList.map(c => (
              <div key={c.id} className="p-3.5 bg-slate-950/80 border border-blue-900/40 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <strong className="text-blue-300 font-bold">{c.lessonTitle}</strong>
                  <span className="text-emerald-400 font-mono font-bold text-[11px] bg-emerald-950 px-2 rounded border border-emerald-900">Passed ({c.score})</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Verification Hash: <strong className="text-white select-all">{c.hash}</strong></span>
                  <span>{c.timestamp}</span>
                </div>
              </div>
            )) : (
              <div className="text-center py-6 text-xs text-slate-500 italic space-y-2">
                <Shield className="w-8 h-8 text-blue-900 mx-auto opacity-70" />
                <p>No verified exams completed yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="frosted-glass rounded-3xl p-6 border border-blue-950 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight uppercase">Core Study Hours Tracking</h3>
            <p className="text-xs text-slate-400">Classroom analytics synced with local device sensors.</p>
          </div>
          <div className="h-44 flex items-end justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-blue-950">
            {[
              { day: "Mon", hrs: 2.5, percent: "45%" }, { day: "Tue", hrs: 4.8, percent: "80%" },
              { day: "Wed", hrs: 3.2, percent: "60%" }, { day: "Thu", hrs: 5.6, percent: "95%" },
              { day: "Fri", hrs: 2.1, percent: "35%" }, { day: "Sat", hrs: 1.2, percent: "25%" },
              { day: "Sun", hrs: 3.9, percent: "70%" }
            ].map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative">
                <div className="bg-slate-900 text-white text-[9px] font-mono px-1 rounded opacity-0 group-hover:opacity-100 transition duration-300 absolute -translate-y-12 shadow-lg border border-slate-700 z-10 pointer-events-none">{bar.hrs} hrs</div>
                <div className="w-full blue-gradient-bg rounded-t-lg transition-all duration-700 relative overflow-hidden shadow-[0_0_8px_rgba(59,130,246,0.3)]" style={{ height: bar.percent }}>
                  <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                </div>
                <span className="text-[10.5px] font-bold text-slate-400 font-mono block">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="frosted-glass rounded-3xl p-6 border border-blue-950 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white uppercase">Sovereign Badge Collection</h3>
          <p className="text-xs text-slate-400">Demonstrate conceptual mastery across curricula to activate permanent badges.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
          {BADGES.map(b => {
            const isUnlocked = progress.unlockedBadges.includes(b.key);
            return (
              <div key={b.key} className={`p-4 rounded-2xl border text-center space-y-2 transition shadow-sm ${isUnlocked ? "bg-slate-950/80 border-[#1e293b]" : "bg-slate-950/20 border-blue-950/40 opacity-40 filter grayscale"}`}>
                <div className={`w-11 h-11 rounded-full mx-auto flex items-center justify-center bg-gradient-to-tr ${b.color} text-white shadow`}>
                  {b.icon === "Sparkles" && <Sparkles className="w-5.5 h-5.5" />}
                  {b.icon === "Cpu" && <Cpu className="w-5.5 h-5.5" />}
                  {b.icon === "Building" && <Building className="w-5.5 h-5.5" />}
                  {b.icon === "Compass" && <Compass className="w-5.5 h-5.5" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-xs tracking-tight uppercase leading-snug">{b.name}</h4>
                  <p className="text-[10px] text-slate-300 leading-snug mt-1 font-light">{b.description}</p>
                </div>
                <div className="flex items-center justify-center gap-1 text-[9px] font-mono tracking-wide">
                  {isUnlocked ? (
                    <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded flex items-center gap-0.5"><Check className="w-3 h-3" /> Unlocked</span>
                  ) : (
                    <span className="text-slate-500 bg-slate-950 px-2 py-0.5 rounded flex items-center gap-0.5"><Lock className="w-3 h-3" /> Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
