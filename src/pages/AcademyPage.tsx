import { useApp } from "../contexts/AppContext";
import { QUIZZES } from "../lessonsData";
import { CheckCircle, ChevronRight, Video, BookOpen, Shield, Check, Send } from "lucide-react";
import TrinityGame from "../components/games/TrinityGame";
import RoboticsGame from "../components/games/RoboticsGame";
import IncentiveGame from "../components/games/IncentiveGame";

export default function AcademyPage() {
  const {
    progress, selectedCurriculum, setSelectedCurriculum,
    selectedLesson, setSelectedLesson,
    activeQuiz, setActiveQuiz, filteredLessons,
    setQuizAnswers, setShowQuizResult,
    startVerifiedProctorExam, stopVerifiedProctorExam,
    handleQuizSubmit, showQuizResult, quizScore,
    isExamProctoring, examTimer, cameraPermissionGranted, videoRef, proctorLogs,
    quizAnswers,
    activeGame, setActiveGame,
  } = useApp();

  const formatExamTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Left: Lesson List */}
      <div className="lg:col-span-1 space-y-6">
        <div className="frosted-glass rounded-2xl p-4 shadow-sm space-y-3">
          <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400 block font-bold">Curriculum Track Filter</span>
          <div className="flex flex-col gap-1.5">
            {[
              { key: "all", name: "All Curriculums" },
              { key: "creed", name: "Philosophy & Creed" },
              { key: "scitech", name: "Sci-Tech & Robotics" },
              { key: "business", name: "Business Mastery" },
              { key: "dynamics", name: "Human Dynamics" }
            ].map(track => (
              <button key={track.key} onClick={() => { setSelectedCurriculum(track.key); setSelectedLesson(null); setActiveQuiz(null); }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between ${
                  selectedCurriculum === track.key ? "bg-blue-600 text-white shadow-sm" : "text-slate-300 hover:bg-blue-950/40"
                }`}>
                {track.name} <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-bold text-white text-sm uppercase tracking-wide px-1">Lessons</h4>
          <div className="space-y-2">
            {filteredLessons.map(les => {
              const isCompleted = progress.completedLessons.includes(les.id);
              return (
                <button key={les.id} onClick={() => { setSelectedLesson(les); setActiveQuiz(null); setActiveGame(null); }}
                  className={`w-full text-left p-4 rounded-xl transition border text-sm relative group flex items-start justify-between gap-3 ${
                    selectedLesson?.id === les.id ? "bg-slate-900 border-blue-500 shadow-md" : "bg-slate-950/40 hover:bg-[#09152b]/55 border-[#121f3d]"
                  }`}>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] uppercase font-mono tracking-widest bg-blue-950 text-blue-400 px-1.5 py-0.5 rounded font-bold border border-blue-900/30">{les.topic}</span>
                      <span className="text-[9px] uppercase font-mono tracking-widest bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded">{les.difficulty}</span>
                    </div>
                    <h4 className="font-extrabold text-white group-hover:text-blue-400 transition">{les.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-1">{les.description}</p>
                  </div>
                  {isCompleted && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Lesson Content / Quiz / Games */}
      <div className="lg:col-span-2 space-y-6">
        {!selectedLesson && !activeQuiz && !activeGame && (
          <div className="frosted-glass rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-950 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto animate-bounce">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-xl text-white uppercase tracking-wider">No Lecture Selected</h3>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">Choose a curriculum track and lesson to get started.</p>
            </div>
          </div>
        )}

        {selectedLesson && !activeQuiz && !activeGame && (
          <div className="frosted-glass-dark rounded-3xl p-6 sm:p-8 border border-blue-950 overflow-hidden relative space-y-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600"></div>
            <div className="flex justify-between items-start flex-wrap gap-4 border-b border-blue-950 pb-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 border border-blue-900/40 px-2 py-0.5 rounded">Track: {selectedLesson.curriculum.toUpperCase()}</span>
                  <span className="text-xs text-slate-400 font-light">• {selectedLesson.durationMin} Min lecture</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">{selectedLesson.title}</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => {
                  const targetQuiz = QUIZZES.find(q => q.lessonId === selectedLesson.id);
                  if (targetQuiz) { setActiveQuiz(targetQuiz); setQuizAnswers(new Array(targetQuiz.questions.length).fill(-1)); setShowQuizResult(false); startVerifiedProctorExam(); }
                }} className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-1.5">
                  <Video className="w-4 h-4 animate-pulse text-red-400" /> Start Proctored Exam
                </button>
              </div>
            </div>
            <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-light">
              {selectedLesson.content}
            </div>
            <div className="flex flex-wrap gap-3 pt-4 border-t border-blue-950">
              <button onClick={() => setActiveQuiz(QUIZZES.find(q => q.lessonId === selectedLesson.id) || null)}
                className="px-4 py-2 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-bold transition">Take Quiz</button>
              <button onClick={() => setActiveGame("trinity")}
                className="px-4 py-2 rounded-lg bg-cyan-800/50 hover:bg-cyan-700 text-cyan-200 text-xs font-bold border border-cyan-700/50 transition">Trinity Game</button>
              <button onClick={() => setActiveGame("robotics")}
                className="px-4 py-2 rounded-lg bg-indigo-800/50 hover:bg-indigo-700 text-indigo-200 text-xs font-bold border border-indigo-700/50 transition">Robotics Calibration</button>
              <button onClick={() => setActiveGame("incentive")}
                className="px-4 py-2 rounded-lg bg-emerald-800/50 hover:bg-emerald-700 text-emerald-200 text-xs font-bold border border-emerald-700/50 transition">Incentive Equation</button>
            </div>
          </div>
        )}

        {/* Quiz */}
        {activeQuiz && !showQuizResult && (
          <div className="frosted-glass-dark rounded-3xl p-6 sm:p-8 border border-blue-950 space-y-6">
            <div className="flex justify-between items-center border-b border-blue-950 pb-4">
              <h3 className="font-extrabold text-white text-lg uppercase">{activeQuiz.title}</h3>
              {isExamProctoring && (
                <span className="px-3 py-1 rounded bg-red-950 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Proctored: {formatExamTime(examTimer)}
                </span>
              )}
            </div>
            {isExamProctoring && (
              <div className="bg-slate-950 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-3">
                  <video ref={videoRef} autoPlay muted playsInline className="w-20 h-16 rounded-lg bg-black border border-blue-900 object-cover" />
                  <div className="text-[10px] font-mono text-slate-400 space-y-0.5 flex-1">
                    {proctorLogs.slice(-3).map((log, i) => (
                      <p key={i} className={`${log.includes("WARNING") ? "text-amber-400" : "text-emerald-400"}`}>{log}</p>
                    ))}
                  </div>
                </div>
                <div className="w-full bg-slate-900 h-1 rounded overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-full transition-all duration-1000" style={{ width: `${(examTimer / 600) * 100}%` }} />
                </div>
              </div>
            )}
            <div className="space-y-6">
              {activeQuiz.questions.map((q, qIdx) => (
                <div key={qIdx} className="space-y-3">
                  <h4 className="text-sm font-bold text-white">{qIdx + 1}. {q.question}</h4>
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => (
                      <button key={oIdx} onClick={() => {
                        const copy = [...quizAnswers]; copy[qIdx] = oIdx; setQuizAnswers(copy);
                      }} className={`w-full text-left p-3 rounded-xl border text-xs transition ${
                        quizAnswers[qIdx] === oIdx ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
                      }`}>{opt}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleQuizSubmit} disabled={quizAnswers.includes(-1)}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                quizAnswers.includes(-1) ? "bg-slate-800 text-slate-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
              }`}>Submit & Verify Answers</button>
          </div>
        )}

        {/* Quiz Result */}
        {showQuizResult && activeQuiz && (
          <div className="frosted-glass-dark rounded-3xl p-8 border border-blue-500 text-center space-y-4 animate-fade-in">
            <h3 className="text-2xl font-extrabold text-white uppercase">Quiz Complete</h3>
            <div className="text-6xl font-extrabold text-blue-400 font-mono">{quizScore}/{activeQuiz.questions.length}</div>
            <p className="text-slate-400 text-sm">{quizScore === activeQuiz.questions.length ? "Perfect score! Badge unlocked!" : "Keep studying and try again!"}</p>
            <button onClick={() => setActiveQuiz(null)} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition">Back to Lessons</button>
          </div>
        )}

        {/* Games */}
        {activeGame === "trinity" && !activeQuiz && <TrinityGame onClose={() => setActiveGame(null)} />}
        {activeGame === "robotics" && !activeQuiz && <RoboticsGame onClose={() => setActiveGame(null)} />}
        {activeGame === "incentive" && !activeQuiz && <IncentiveGame onClose={() => setActiveGame(null)} />}

        {/* Proctor Exam Button (when no quiz active) */}
        {isExamProctoring && !activeQuiz && (
          <div className="frosted-glass rounded-2xl p-6 border border-red-900 text-center space-y-4">
            <Shield className="w-10 h-10 text-red-400 mx-auto animate-pulse" />
            <h3 className="font-bold text-white">Proctoring Active</h3>
            <p className="text-xs text-slate-400">Time remaining: {formatExamTime(examTimer)}</p>
            <button onClick={() => stopVerifiedProctorExam(0, 0)} className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white text-xs">Stop Proctoring</button>
          </div>
        )}
      </div>
    </div>
  );
}
