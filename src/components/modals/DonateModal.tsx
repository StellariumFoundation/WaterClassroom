import { useApp } from "../../contexts/AppContext";
import { Heart } from "lucide-react";

export default function DonateModal() {
  const {
    showDirectDonateModal, setShowDirectDonateModal,
    simulatedDonationAmount, setSimulatedDonationAmount,
    donationSuccess, handleSimulatedSupport
  } = useApp();

  if (!showDirectDonateModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="frosted-glass-dark p-6 sm:p-8 rounded-3xl max-w-md w-full border border-rose-500/20 text-center space-y-6">
        <div className="w-14 h-14 bg-rose-950 border border-rose-500/30 rounded-full flex items-center justify-center text-rose-400 mx-auto">
          <Heart className="w-7 h-7 fill-rose-500" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-2xl font-extrabold text-white">Sponsor a Student</h3>
          <p className="text-xs text-slate-400">Your contribution directly sponsors curriculum access for students in need.</p>
        </div>

        {donationSuccess ? (
          <div className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 p-6 rounded-xl text-center space-y-2 animate-fade-in">
            <span className="font-bold text-lg block">✓ DONATION COMMITTED</span>
            <p className="text-xs">+500 XP awarded for your generosity!</p>
          </div>
        ) : (
          <form onSubmit={handleSimulatedSupport} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Donation Amount (USD)</label>
              <input type="number" value={simulatedDonationAmount} onChange={e => setSimulatedDonationAmount(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 p-3 text-2xl font-extrabold text-white text-center focus:outline-none focus:border-rose-500 font-mono" />
            </div>
            <div className="flex gap-2 justify-center pt-2">
              {[50, 100, 250, 500].map(amt => (
                <button key={amt} type="button" onClick={() => setSimulatedDonationAmount(String(amt))}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition ${simulatedDonationAmount === String(amt) ? "bg-rose-600 text-white border-rose-500" : "bg-slate-900 text-slate-400 border-slate-700 hover:border-rose-500"}`}>
                  ${amt}
                </button>
              ))}
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-500/20">
              Donate ${parseInt(simulatedDonationAmount) || 0}
            </button>
          </form>
        )}

        <button onClick={() => setShowDirectDonateModal(false)}
          className="text-xs text-slate-500 hover:text-slate-300 transition">
          {donationSuccess ? "Close" : "Maybe later"}
        </button>
      </div>
    </div>
  );
}
