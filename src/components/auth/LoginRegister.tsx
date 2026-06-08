import { FormEvent } from "react";

interface LoginRegisterProps {
  landingAuthRole: "student" | "school";
  setLandingAuthRole: (role: "student" | "school") => void;
  tursoSuccessMsg: string;
  handleLandingAuthSubmit: (e: FormEvent) => void;
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginAccessKey: string;
  setLoginAccessKey: (key: string) => void;
  tursoLoading: boolean;
}

export default function LoginRegister({
  landingAuthRole,
  setLandingAuthRole,
  tursoSuccessMsg,
  handleLandingAuthSubmit,
  loginEmail,
  setLoginEmail,
  loginAccessKey,
  setLoginAccessKey,
  tursoLoading
}: LoginRegisterProps) {
  return (
    <div id="auth-section" className="frosted-glass p-6 sm:p-8 rounded-3xl border border-blue-500/20 shadow-2xl relative overflow-hidden flex flex-col h-full justify-between">
      <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 p-1 bg-slate-950/60 rounded-xl border border-blue-950">
          <button
            onClick={() => setLandingAuthRole("student")}
            className={`py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase ${
              landingAuthRole === "student"
                ? "bg-blue-600 text-white shadow-md font-extrabold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            👤 Student Division
          </button>
          <button
            onClick={() => setLandingAuthRole("school")}
            className={`py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase ${
              landingAuthRole === "school"
                ? "bg-indigo-600 text-white shadow-md font-extrabold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🏫 Institution Division
          </button>
        </div>

        <form onSubmit={handleLandingAuthSubmit} className="space-y-4">
          {tursoSuccessMsg && (
            <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-xl text-xs space-y-1 font-mono animate-fade-in mb-3">
              <span className="font-bold text-white block">✓ RECORD COMMITTED SECURELY</span>
              <p>{tursoSuccessMsg}</p>
            </div>
          )}

          {landingAuthRole === "student" ? (
            <div className="bg-[#0b1329] border border-blue-900/30 rounded-xl p-3 text-xs text-blue-300 space-y-1">
              <span className="font-bold text-white block text-[10px] uppercase font-mono tracking-wider">🌟 Student Division Portal</span>
              Enter your credentials to instantly authenticate or register and access interactive physics simulations, labs, quizzes, and 24/7 Socratic tutoring.
            </div>
          ) : (
            <div className="bg-[#11103a] border border-indigo-900/30 rounded-xl p-3 text-xs text-indigo-300 space-y-1">
              <span className="font-bold text-white block text-[10px] uppercase font-mono tracking-wider">🏫 Institutional Portal</span>
              Authenticate your academy credentials to access the bulk registry, manage student nodes, and monitor academic progress.
            </div>
          )}
          
          <input 
            type="email" 
            placeholder="Email address"
            className="w-full bg-slate-950/80 border border-blue-900 rounded-xl p-3 text-white text-sm"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Access Key / Passcode"
            className="w-full bg-slate-950/80 border border-blue-900 rounded-xl p-3 text-white text-sm"
            value={loginAccessKey}
            onChange={(e) => setLoginAccessKey(e.target.value)}
          />
          <button 
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm uppercase shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
            disabled={tursoLoading}
          >
            {tursoLoading ? "Authenticating..." : "Authorize Entry"}
          </button>
        </form>
      </div>
    </div>
  );
}
