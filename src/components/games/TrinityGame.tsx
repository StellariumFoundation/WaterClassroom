import { useApp } from "../../contexts/AppContext";

export default function TrinityGame({ onClose }: { onClose: () => void }) {
  const {
    trinityGood, setTrinityGood,
    trinityMoney, setTrinityMoney,
    trinityFun, setTrinityFun,
    trinityWinner,
  } = useApp();

  const sliders = [
    { label: "Do Good", val: trinityGood, set: setTrinityGood, color: "blue" },
    { label: "Make Money", val: trinityMoney, set: setTrinityMoney, color: "emerald" },
    { label: "Have Fun", val: trinityFun, set: setTrinityFun, color: "amber" },
  ] as const;

  return (
    <div className="frosted-glass-dark rounded-3xl p-6 sm:p-8 border border-blue-950 space-y-6">
      <h3 className="font-extrabold text-lg text-white">Trinity Alignment Game</h3>
      <p className="text-xs text-slate-400">Balance all three sliders to 100 for perfect alignment!</p>
      {sliders.map(s => (
        <div key={s.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-bold">{s.label}</span>
            <span className="text-white font-mono">{s.val}%</span>
          </div>
          <input
            type="range" min={0} max={100} value={s.val}
            onChange={e => s.set(parseInt(e.target.value))}
            className={`w-full accent-${s.color}-500`}
          />
        </div>
      ))}
      {trinityWinner ? (
        <div className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-center animate-fade-in">
          <span className="font-bold text-lg">✓ PERFECT ALIGNMENT! +150 XP</span>
        </div>
      ) : (
        <p className="text-xs text-slate-500 text-center">All sliders at 100 to win</p>
      )}
      <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs transition">
        Close Game
      </button>
    </div>
  );
}
