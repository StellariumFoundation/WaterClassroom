import { CheckCircle, ChevronRight, Video, Sparkles, MessageSquare, BookOpen, Shield, Check } from "lucide-react";
import { QUIZZES } from "../../lessonsData";
import { Lesson, Quiz, StudentProgress } from "../../types";

export interface AcademyTabProps {
  progress: StudentProgress;
  selectedCurriculum: string;
  setSelectedCurriculum: (curriculum: string) => void;
  selectedLesson: Lesson | null;
  setSelectedLesson: (lesson: Lesson | null) => void;
  setActiveQuiz: (quiz: Quiz | null) => void;
  setActiveGame: (game: string | null) => void;
  filteredLessons: Lesson[];
  setQuizAnswers: (answers: number[]) => void;
  setShowQuizResult: (show: boolean) => void;
  startVerifiedProctorExam: () => void;
  activeQuiz: Quiz | null;
  examTimer: number;
  cameraPermissionGranted: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  proctorLogs: string[];
  quizAnswers: number[];
  handleQuizSubmit: () => void;
  showQuizResult: boolean;
  quizScore: number;
  stopVerifiedProctorExam: (score: number, total: number) => void;
  handleSendMessage: (msg: string) => void;
  setActiveTab: (tab: any) => void;
  trinityGood: number;
  setTrinityGood: (val: number) => void;
  trinityMoney: number;
  setTrinityMoney: (val: number) => void;
  trinityFun: number;
  setTrinityFun: (val: number) => void;
  trinityWinner: boolean;
  robotHip: number;
  setRobotHip: (val: number) => void;
  robotKnee: number;
  setRobotKnee: (val: number) => void;
  robotAnkle: number;
  setRobotAnkle: (val: number) => void;
  robotBalanced: boolean;
  incRevenue: number;
  setIncRevenue: (val: number) => void;
  incCosts: number;
  setIncCosts: (val: number) => void;
  incBase: number;
  setIncBase: (val: number) => void;
  incKwhPrice: number;
  setIncKwhPrice: (val: number) => void;
  calculatedRewardMultiplier: () => number;
}

export default function AcademyTab({
  progress,
  selectedCurriculum,
  setSelectedCurriculum,
  selectedLesson,
  setSelectedLesson,
  setActiveQuiz,
  setActiveGame,
  filteredLessons,
  setQuizAnswers,
  setShowQuizResult,
  startVerifiedProctorExam,
  activeQuiz,
  examTimer,
  cameraPermissionGranted,
  videoRef,
  proctorLogs,
  quizAnswers,
  handleQuizSubmit,
  showQuizResult,
  quizScore,
  stopVerifiedProctorExam,
  handleSendMessage,
  setActiveTab,
  trinityGood,
  setTrinityGood,
  trinityMoney,
  setTrinityMoney,
  trinityFun,
  setTrinityFun,
  trinityWinner,
  robotHip,
  setRobotHip,
  robotKnee,
  setRobotKnee,
  robotAnkle,
  setRobotAnkle,
  robotBalanced,
  incRevenue,
  setIncRevenue,
  incCosts,
  setIncCosts,
  incBase,
  setIncBase,
  incKwhPrice,
  setIncKwhPrice,
  calculatedRewardMultiplier
}: AcademyTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        <div className="lg:col-span-1 space-y-6">
            <div className="frosted-glass rounded-2xl p-4 shadow-sm space-y-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#60a5fa] block font-bold">
                    Curriculum Track filter
                </span>
                <div className="flex flex-col gap-1.5">
                    {[
                    { key: "all", name: "All Curriculums" },
                    { key: "creed", name: "Philosophy & Creed" },
                    { key: "scitech", name: "Sci-Tech & Robotics" },
                    { key: "business", name: "Business Mastery" },
                    { key: "dynamics", name: "Human Dynamics" }
                    ].map((track) => (
                    <button
                        key={track.key}
                        onClick={() => {
                        setSelectedCurriculum(track.key);
                        setSelectedLesson(null);
                        setActiveQuiz(null);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-between ${
                        selectedCurriculum === track.key
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-300 hover:bg-blue-950/40"
                        }`}
                    >
                        {track.name}
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="font-bold text-white text-sm uppercase tracking-wide px-1">
                    Core Lectures List
                </h4>
                
                <div className="space-y-2">
                    {filteredLessons.map((les) => {
                    const isCompleted = progress.completedLessons.includes(les.id);
                    return (
                        <button
                        key={les.id}
                        onClick={() => {
                            setSelectedLesson(les);
                            setActiveQuiz(null);
                            setActiveGame(null);
                        }}
                        className={`w-full text-left p-4 rounded-xl transition border text-sm relative group flex items-start justify-between gap-3 ${
                            selectedLesson?.id === les.id
                            ? "bg-slate-900 border-blue-500 shadow-md"
                            : "bg-slate-950/40 hover:bg-[#09152b]/55 border-[#121f3d] shadow-sm"
                        }`}
                        >
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[9px] uppercase font-mono tracking-widest bg-blue-950 text-blue-400 px-1.5 py-0.5 rounded font-bold border border-blue-900/30">
                                {les.topic}
                            </span>
                            <span className="text-[9px] uppercase font-mono tracking-widest bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded">
                                {les.difficulty}
                            </span>
                            </div>
                            <h4 className="font-extrabold text-white group-hover:text-blue-400 transition">
                            {les.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 leading-snug line-clamp-1">
                            {les.description}
                            </p>
                        </div>
                        {isCompleted && (
                            <CheckCircle className="w-5 h-5 text-emerald-400 grow-0 shrink-0 mt-1" />
                        )}
                        </button>
                    );
                    })}
                </div>
            </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
            {selectedLesson ? (
                <div className="frosted-glass-dark rounded-3xl p-6 sm:p-8 border border-blue-950 overflow-hidden relative space-y-6">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600"></div>
                     <div className="flex justify-between items-start flex-wrap gap-4 border-b border-blue-950 pb-5">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 border border-blue-900/40 px-2 py-0.5 rounded">
                                Track: {selectedLesson.curriculum.toUpperCase()}
                                </span>
                                <span className="text-xs text-slate-400 font-light">• {selectedLesson.durationMin} Min lecture</span>
                            </div>
                            <h2 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight leading-tight">
                                {selectedLesson.title}
                            </h2>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                const targetQuiz = QUIZZES.find((q) => q.lessonId === selectedLesson.id);
                                if (targetQuiz) {
                                    setActiveQuiz(targetQuiz);
                                    setQuizAnswers(new Array(targetQuiz.questions.length).fill(-1));
                                    setShowQuizResult(false);
                                    startVerifiedProctorExam();
                                }
                                }}
                                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-1.5"
                            >
                                <Video className="w-4 h-4 animate-pulse text-red-400" /> Start Proctored Exam
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="frosted-glass rounded-3xl p-12 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-blue-950 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto animate-bounce">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-xl text-white uppercase tracking-wider">No Lecture Selected</h3>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      Choose any core curriculum track filter from the left panel to browse masterclasses, test your knowledge, and take exams.
                    </p>
                  </div>
                </div>
              )
            }
        </div>
    </div>
  );
}
