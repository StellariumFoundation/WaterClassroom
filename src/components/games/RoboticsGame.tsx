import { useApp } from "../../contexts/AppContext";

export default function RoboticsGame({ onClose }: { onClose: () => void }) {
  const {
    robotHip, setRobotHip,
    robotKnee, setRobotKnee,
    robotAnkle, setRobotAnkle,
    robotBalanced,
  } = useApp();

  const sliders = [
    { label: "Hip", val: robotHip, set: setRobotHip, min: 0, max: 180, target: "60-70" },
    { label: "Knee", val: robotKnee, set: setRobotKnee, min: 0, max: 180, target: "92-98" },
    { label: "Ankle", val: robotAnkle, set: setRobotAnkle, min: 0, max: 180, target: "82-88" },
  ] as const;

  return (
    <div className="frosted-glass-dark rounded-3xl p-6 sm:p-8 border border-blue-950 space-y-6">
      <h3 className="font-extrabold text-lg text-white">Robotics Joint Calibration</h3>
      <p className="text-xs text-slate-400">Calibrate joints: Hip (60-70°), Knee (92-98°), Ankle (82-88°)</p>
      {sliders.map(s => (
        <div key={s.label} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300 font-bold">{s.label} ({s.target}°)</span>
            <span className="text-white font-mono">{s.val}°</span>
          </div>
          <input
            type="range" min={s.min} max={s.max} value={s.val}
            onChange={e => s.set(parseInt(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
      ))}
      {robotBalanced && (
        <div className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl text-center animate-fade-in">
          <span className="font-bold text-lg">✓ ROBOT BALANCED! +200 XP</span>
        </div>
      )}
      <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs transition">
        Close Game
      </button>
    </div>
  );
}
