import { useApp } from "../contexts/AppContext";
import { Cpu, User, Send } from "lucide-react";

export default function AITutorPage() {
  const {
    chatMessages, chatInput, setChatInput, chatBottomRef, isTutorTyping, handleSendMessage
  } = useApp();

  return (
    <div className="frosted-glass rounded-3xl shadow-2xl border border-blue-950 max-w-4xl mx-auto h-[70vh] flex flex-col overflow-hidden animate-fade-in relative">
      <div className="absolute inset-0 pr-12 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Header */}
      <div className="bg-[#050b18]/80 p-4 border-b border-blue-950 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-950 border border-blue-500/20 flex items-center justify-center text-blue-400 relative">
            <Cpu className="w-5 h-5 animate-pulse" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-slate-900"></span>
          </div>
          <div>
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wide">Water Tutor v1.4 Fluid</h3>
            <p className="text-[10px] text-emerald-400 font-mono tracking-wide">● SEED ACTIVE (LATENCY 45ms)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono tracking-wider font-bold bg-[#1e1b4b] border border-blue-800/40 text-blue-300 px-2.5 py-1 rounded">24/7 Socratic Aid</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
        {chatMessages.map((msg, idx) => {
          const isTutor = msg.sender === "tutor";
          return (
            <div key={msg.id || idx} className={`flex gap-3 max-w-3xl animate-fade-in ${isTutor ? "" : "ml-auto flex-row-reverse"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isTutor ? "bg-blue-950 border border-blue-500/30 text-blue-400" : "bg-cyan-950 border border-cyan-500/30 text-cyan-400"}`}>
                {isTutor ? <Cpu className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className="space-y-1">
                <div className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${isTutor ? "bg-slate-950/85 border border-blue-950 text-slate-200" : "bg-blue-600 text-white"}`}>
                  {msg.text.split("\n\n").map((para, pIdx) => {
                    if (para.startsWith("###")) return <h4 key={pIdx} className="font-bold text-white text-xs sm:text-sm mb-1 uppercase tracking-wide">{para.replace("###", "").trim()}</h4>;
                    if (para.startsWith("- **") || para.startsWith("- ")) return <p key={pIdx} className="pl-3 border-l border-blue-800/70 font-mono text-xs">{para}</p>;
                    return <p key={pIdx} className="mb-1.5 last:mb-0">{para}</p>;
                  })}
                </div>
                <span className="text-[9px] font-mono text-slate-500 block px-1 text-right">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}
        {isTutorTyping && (
          <div className="flex gap-3 max-w-lg">
            <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Cpu className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-950 border border-blue-950 rounded-2xl px-4 py-3 text-xs font-mono text-slate-400 flex items-center gap-1">
              <span>Socratic processing</span>
              <span className="animate-ping text-blue-400">...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-[#050b18]/80 border-t border-blue-950/70 shrink-0">
        <div className="flex gap-2.5">
          <input type="text" placeholder="Ask standard Common Core math, Unitree kinetics, or Abundance creed logic..."
            value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSendMessage(); }}
            className="flex-grow rounded-xl bg-slate-900 border border-slate-700/60 px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500" />
          <button onClick={() => handleSendMessage()}
            className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center justify-center shadow shadow-blue-500/20">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
