import { useApp } from "../../contexts/AppContext";

export default function IncentiveGame({ onClose }: { onClose: () => void }) {
  const {
    incBase, setIncBase,
    incRevenue, setIncRevenue,
    incCosts, setIncCosts,
    incKwhPrice, setIncKwhPrice,
    calculatedRewardMultiplier,
  } = useApp();

  const sliders = [
    { label: "Base Salary", val: incBase, set: setIncBase, min: 500, max: 200000 },
    { label: "Revenue", val: incRevenue, set: setIncRevenue, min: 1000, max: 200000 },
    { label: "Costs", val: incCosts, set: setIncCosts, min: 1000, max: 200000 },
    { label: "kWh Price", val: incKwhPrice, set: setIncKwhPrice, min: 5, max: 200 },
  ] as const;

  return (
    <div className="frosted-glass-dark rounded-3xl p-6 sm:p-8 border border-blue-950 space-y-6">
      <h3 className="font-extrabold text-lg text-white">Incentive Equation Simulator</h3>
      <p className="text-xs text-slate-400">Adjust parameters to see the Reward Multiplier change.</p>
      {sliders.map(s => (
        <div key={s.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-bold">{s.label}</span>
            <span className="text-white font-mono">
              ${typeof s.val === 'number'
                ? (s.label === 'kWh Price' ? s.val.toFixed(2) : s.val.toLocaleString())
                : s.val}
            </span>
          </div>
          <input
            type="range" min={s.min} max={s.max} value={typeof s.val === 'number' ? s.val : 0}
            onChange={e => s.set(parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>
      ))}
      <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/40 text-center">
        <span className="text-xs text-slate-400 block">Reward Multiplier</span>
        <strong className="text-3xl font-extrabold text-emerald-400 font-mono">{calculatedRewardMultiplier()}x</strong>
      </div>
      <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs transition">
        Close Game
      </button>
    </div>
  );
}
