import { ArrowRight, Compass, Heart, Calculator, Cpu, Building, ChevronDown, Download, AlertCircle } from "lucide-react";

export interface HomepageTabProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  setIsOnboarded: (isOnboarded: boolean) => void;
  setShowDirectDonateModal: (show: boolean) => void;
  onboardingCurriculum: string;
  calcStudents: number;
  setCalcStudents: (val: number) => void;
  calcBilling: string;
  setCalcBilling: (val: string) => void;
  calcCustomSupport: boolean;
  setCalcCustomSupport: (val: boolean) => void;
  calculateInstitutionalBulkCost: () => string;
  expandedFaq: number | null;
  setExpandedFaq: (idx: number | null) => void;
}

export default function HomepageTab({
  activeTab,
  setActiveTab,
  setIsOnboarded,
  setShowDirectDonateModal,
  onboardingCurriculum,
  calcStudents,
  setCalcStudents,
  calcBilling,
  setCalcBilling,
  calcCustomSupport,
  setCalcCustomSupport,
  calculateInstitutionalBulkCost,
  expandedFaq,
  setExpandedFaq,
}: HomepageTabProps) {
  return (
    <>
      {activeTab === "launch" && (
        <div className="space-y-12 animate-fade-in text-slate-100">
          
          {/* Hero Pitch Banner */}
          <div className="blue-gradient-bg rounded-3xl p-6 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-blue-400/20">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl"></div>
            <div className="absolute left-1/3 bottom-0 -mb-16 w-80 h-80 bg-cyan-300/25 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-4xl space-y-6">
              <span className="px-3.5 py-1.5 rounded-full bg-blue-900/60 text-[10px] font-extrabold uppercase tracking-widest border border-blue-300/30 backdrop-blur-md">
                ✨ NOW OPEN: A NEW ERA OF HUMAN LEARNING
              </span>
              
              <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight uppercase font-sans">
                The Water Classroom:<br className="hidden sm:block"/> Redefining Education in the AI Era
              </h2>
              
              <p className="text-sm sm:text-lg text-blue-50 font-normal leading-relaxed max-w-3xl">
                Break down institutional barriers once and for all. We provide K-12 and undergraduate students, educators, and institutions with a complete, AI-powered virtual school. Engage with gamified curriculums tailored to U.S. Common Core, UK GCSE or IB tracks, consult 24/7 AI tutors, and unleash creativity with interactive labs—all from a single, transformative platform.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setActiveTab("academy")}
                  className="px-8 py-3.5 rounded-xl bg-white text-blue-950 font-extrabold text-xs tracking-wider uppercase transition hover:bg-blue-50 active:scale-95 shadow-lg flex items-center gap-2"
                >
                  Enter Open Academy <ArrowRight className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={() => setIsOnboarded(false)}
                  className="px-6 py-3.5 rounded-xl bg-blue-950/60 text-blue-100 font-bold text-xs tracking-wider uppercase border border-blue-400/30 hover:bg-blue-950 transition flex items-center gap-2"
                >
                  <Compass className="w-4.5 h-4.5 text-blue-300 animate-pulse" /> Change Curriculum Track
                </button>
                <button
                  onClick={() => setShowDirectDonateModal(true)}
                  className="px-6 py-3.5 rounded-xl bg-rose-950/50 text-rose-200 font-semibold border border-rose-500/30 hover:bg-rose-900/60 text-xs uppercase tracking-wider transition flex items-center gap-2"
                >
                  <Heart className="w-4.5 h-4.5 text-rose-300 fill-rose-500 animate-pulse" /> Sponsor Student
                </button>
              </div>
            </div>
          </div>

          {/* Explanatory Segment: The Strategic Pillars of Our Modern Academy */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h3 className="text-xs uppercase tracking-widest font-mono text-blue-400 font-extrabold">Executive Summary</h3>
              <h4 className="text-2xl sm:text-3xl font-extrabold text-white uppercase">A Complete Educational Ecosystem</h4>
              <p className="text-xs sm:text-sm text-slate-400 font-light">
                The Water Classroom democratizes access to high-quality education. By integrating cutting-edge artificial intelligence with comprehensive curriculum alignment, we bridge educational gaps and empower K-12 to undergraduate learners globally.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div id="card-curriculum" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102">
                <div className="w-12 h-10 rounded-xl bg-blue-950/50 border border-blue-400/30 flex items-center justify-center text-blue-400 text-shadow-glow">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">AI-Tailored Curriculum</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Dynamic lessons aligned with national and international standards, adaptable to individual learning paces and styles. Interactive multimedia content and games are designed to supercharge the learning experience.
                </p>
              </div>

              <div id="card-tutoring" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102">
                <div className="w-12 h-10 rounded-xl bg-cyan-950/50 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                  <Cpu className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">24/7 AI Tutoring & Homework</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Our AI tutors offer step-by-step teaching, real-time feedback, and guidance. Advanced automated grading algorithms provide actionable insights for both students and educators around the clock.
                </p>
              </div>

              <div id="card-innovation" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102">
                <div className="w-12 h-10 rounded-xl bg-indigo-950/50 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">Innovation & Creativity Labs</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Project-based learning modules connect core concepts to real-world scenarios. Engage in gamified engineering challenges and creative problem-solving to foster critical thinking and boundless imagination.
                </p>
              </div>

              <div id="card-analytics" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102 lg:col-span-1 md:col-span-1">
                <div className="w-12 h-10 rounded-xl bg-emerald-950/50 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                  <Calculator className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">Progress Analytics Dashboard</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Users can rigorously track academic performance, engagement streaks, and skill development. Generates customizable, detailed growth reports for teachers, parents, and administrative oversight.
                </p>
              </div>

              <div id="card-collaborative" className="frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102 lg:col-span-2 md:col-span-2 lg:flex lg:gap-6 lg:items-center lg:space-y-0">
                <div className="flex-shrink-0 w-12 h-10 rounded-xl bg-rose-950/50 border border-rose-400/30 flex items-center justify-center text-rose-400 lg:w-16 lg:h-16">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">Collaborative Learning Ecosystem</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-light max-w-xl">
                    The platform includes seamlessly integrated virtual classrooms, moderated peer discussion forums, and dedicated educator tools, crafting a shared environment for robust curriculum management.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ... (Other sections from original code would follow here similarly) ... */}
          
        </div>
      )}
    </>
  );
}
