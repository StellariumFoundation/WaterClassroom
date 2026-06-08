import { useApp } from "../contexts/AppContext";
import { ArrowRight, Compass, Cpu, Building, Calculator, Heart, ChevronDown } from "lucide-react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LandingPage() {
  const {
    landingAuthRole, setLandingAuthRole,
    landingAuthMode, setLandingAuthMode,
    loginEmail, setLoginEmail, loginAccessKey, setLoginAccessKey,
    tursoSuccessMsg, tursoLoading, handleLandingAuthSubmit,
    landingAuthErrors, setLandingAuthErrors,
    regName, setRegName, regSchoolName, setRegSchoolName,
    regRepName, setRegRepName, regStudentVolume, setRegStudentVolume,
    regBillingCycle, setRegBillingCycle,
    schoolEnrollCode, setSchoolEnrollCode,
    studentBillingCycle, setStudentBillingCycle,
    calcStudents, setCalcStudents, calcBilling, setCalcBilling,
    calculateInstitutionalBulkCost,
    contactName, setContactName, contactEmail, setContactEmail, contactMsg, setContactMsg,
    contactConfirmed, isSendingContact, sendingStatus, contactErrorMsg, executeSendMessage,
    expandedFaq, setExpandedFaq,
    onboardingCurriculum,
  } = useApp();

  const onBlurEmail = () => {
    if (loginEmail && !EMAIL_REGEX.test(loginEmail.trim())) {
      setLandingAuthErrors(prev => ({ ...prev, email: "Please enter a valid email address." }));
    } else if (landingAuthErrors.email) {
      setLandingAuthErrors(prev => ({ ...prev, email: undefined }));
    }
  };
  const onBlurPassword = () => {
    if (loginAccessKey && loginAccessKey.length < 6) {
      setLandingAuthErrors(prev => ({ ...prev, password: "Password must be at least 6 characters." }));
    } else if (landingAuthErrors.password) {
      setLandingAuthErrors(prev => ({ ...prev, password: undefined }));
    }
  };

  return (
    <div className="space-y-16 animate-fade-in text-slate-100 pb-12">
      {/* Hero Pitch Banner */}
      <div className="blue-gradient-bg rounded-3xl p-6 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-blue-400/20">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-64 h-64 bg-blue-300/30 rounded-full blur-3xl"></div>
        <div className="absolute left-1/3 bottom-0 -mb-16 w-80 h-80 bg-cyan-300/25 rounded-full blur-3xl"></div>
        <div className="relative z-10 max-w-4xl space-y-6">
          <span className="px-3.5 py-1.5 rounded-full bg-blue-900/60 text-[10px] font-extrabold uppercase tracking-widest border border-blue-300/30 backdrop-blur-md animate-pulse">
            ✨ NOW OPEN: A NEW ERA OF HUMAN LEARNING
          </span>
          <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight uppercase font-sans">
            The Water Classroom:<br className="hidden sm:block" /> Redefining Education in the AI Era
          </h2>
          <p className="text-sm sm:text-lg text-blue-50 font-normal leading-relaxed max-w-3xl font-light">
            Break down institutional barriers once and for all. We provide K-12 and undergraduate students, educators, and institutions with a complete, AI-powered virtual school. Engage with gamified curriculums tailored to U.S. Common Core, UK GCSE or IB tracks, consult 24/7 AI tutors, and unleash creativity with interactive labs—all from a single, transformative platform.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <a href="#auth-section" className="px-8 py-3.5 rounded-xl bg-white text-blue-950 font-extrabold text-xs tracking-wider uppercase transition hover:bg-blue-50 active:scale-95 shadow-lg flex items-center gap-2 cursor-pointer no-underline">
              Enter Student & Institution Portal <ArrowRight className="w-4 h-4 text-blue-600" />
            </a>
            <a href="#prices-section" className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 transition text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer no-underline">
              View Pricing & Plans
            </a>
          </div>
        </div>
      </div>

      {/* Auth Section */}
      <div id="auth-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
          <span className="text-xs font-mono uppercase text-blue-400 tracking-wider font-bold">Secure Access Gateway</span>
          <h3 className="text-3xl font-extrabold text-white uppercase leading-tight">Create your Student ledger or register your school</h3>
          <p className="text-sm text-slate-300 leading-relaxed font-light">Welcome to the decentralized enrollment protocol. Select your division and complete authentication.</p>
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-blue-950 border border-blue-500/20 text-blue-400 flex items-center justify-center p-1 mt-0.5 text-xs font-bold">✓</div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">Independent Student Records</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">Gain instant access to physics reactors, first-principles logic modules, and 24/7 Socratic help.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded bg-indigo-950 border border-indigo-500/20 text-indigo-400 flex items-center justify-center p-1 mt-0.5 text-xs font-bold">✓</div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase">Institutional Microschool Sandboxing</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">Activate group profiles, manage customized task assignments, and review eye-tracking focal proctor audits.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1" />
        <div className="lg:col-span-6">
          <div className="frosted-glass p-6 sm:p-8 rounded-3xl border border-blue-500/20 shadow-2xl relative overflow-hidden flex flex-col h-full justify-between">
            <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-blue-950">
                {[
                  { key: "student" as const, label: "Student", icon: "🎓", color: "bg-blue-600" },
                  { key: "institution" as const, label: "Institution", icon: "🏛️", color: "bg-indigo-600" },
                ].map(opt => {
                  const isStudentMode = landingAuthRole !== "institution";
                  const isActive = opt.key === "student" ? isStudentMode : landingAuthRole === "institution";
                  return (
                    <button key={opt.key}
                      onClick={() => {
                        if (opt.key === "student") {
                          // Default to water-student (will be refined during onboarding)
                          if (landingAuthRole === "institution") setLandingAuthRole("water-student");
                        } else {
                          setLandingAuthRole("institution");
                        }
                      }}
                      className={`py-2 sm:py-3 text-[10px] sm:text-xs font-bold rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 uppercase leading-tight ${
                        isActive
                          ? `${opt.color} text-white shadow-md font-extrabold`
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="text-sm">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              <form onSubmit={handleLandingAuthSubmit} className="space-y-4" noValidate>
                {/* ─── Login / Register toggle ─── */}
                <div className="grid grid-cols-2 p-0.5 bg-slate-950/80 rounded-lg border border-slate-800">
                  <button type="button" onClick={() => { setLandingAuthMode("login"); setLandingAuthErrors({}); }}
                    className={`py-2.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 uppercase ${landingAuthMode === "login" ? "bg-blue-600 text-white shadow-md font-extrabold" : "text-slate-400 hover:text-slate-200"}`}>
                    🔑 Login
                  </button>
                  <button type="button" onClick={() => { setLandingAuthMode("register"); setLandingAuthErrors({}); }}
                    className={`py-2.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-1.5 uppercase ${landingAuthMode === "register" ? "bg-emerald-600 text-white shadow-md font-extrabold" : "text-slate-400 hover:text-slate-200"}`}>
                    📝 Register
                  </button>
                </div>

                {/* ─── Inline form-level error ─── */}
                {landingAuthErrors.form && (
                  <div className="bg-rose-950/80 border border-rose-500/40 text-rose-300 p-3 rounded-xl text-[11px] font-mono animate-fade-in">
                    ⚠ {landingAuthErrors.form}
                  </div>
                )}

                {/* ─── Success message ─── */}
                {tursoSuccessMsg && (
                  <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 p-3.5 rounded-xl text-xs space-y-1 font-mono animate-fade-in">
                    <span className="font-bold text-white block">✓ RECORD COMMITTED SECURELY</span>
                    <p>{tursoSuccessMsg}</p>
                  </div>
                )}

                {/* ─── Portal description ─── */}
                {landingAuthRole !== "institution" && (
                  <div className="bg-[#0b2940] border border-blue-900/30 rounded-xl p-3 text-xs text-blue-300 space-y-1">
                    <span className="font-bold text-white block text-[10px] uppercase font-mono tracking-wider">🎓 Student Portal</span>
                    {landingAuthMode === "login" ? "Sign in to access your curriculum, AI tutor, and learning dashboard." : "Register to begin your learning journey. Choose your plan (Water School, Independent, or School-enrolled) during onboarding."}
                  </div>
                )}
                {landingAuthRole === "institution" && (
                  <div className="bg-[#11103a] border border-indigo-900/30 rounded-xl p-3 text-xs text-indigo-300 space-y-1">
                    <span className="font-bold text-white block text-[10px] uppercase font-mono tracking-wider">🏛️ Institution Portal</span>
                    {landingAuthMode === "login" ? "Sign in with your coordinator credentials to manage rosters, settings, and reports." : "Register your school or co-op to deploy group profiles, assign students, and access admin tools."}
                  </div>
                )}

                {/* ─── REGISTER: Student extra fields ─── */}
                {landingAuthMode === "register" && landingAuthRole !== "institution" && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Full Name <span className="text-rose-400">*</span></label>
                      <input type="text" required placeholder="e.g. Alice Vance"
                        value={regName} onChange={e => setRegName(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                      {landingAuthErrors.name && <p className="text-rose-400 text-[10px] mt-0.5 font-mono">⚠ {landingAuthErrors.name}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">School Enrollment Code (Optional)</label>
                      <input type="text" placeholder="e.g. W-CLASS-2026"
                        value={schoolEnrollCode} onChange={e => setSchoolEnrollCode(e.target.value.toUpperCase())}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 uppercase tracking-widest font-mono" />
                      <p className="text-[9px] text-slate-500 mt-0.5">Enter your school's access code if you have one.</p>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">
                      💰 Choose your plan during onboarding: Water Student ($19/mo), Independent ($15/mo), or School Student ($12/mo, billed to school).
                    </p>
                  </div>
                )}

                {/* ─── REGISTER: Institution extra fields ─── */}
                {landingAuthMode === "register" && landingAuthRole === "institution" && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">School / Institution Name <span className="text-rose-400">*</span></label>
                      <input type="text" required placeholder="e.g. Sovereign Florida Homeschool"
                        value={regSchoolName} onChange={e => setRegSchoolName(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                      {landingAuthErrors.schoolName && <p className="text-rose-400 text-[10px] mt-0.5 font-mono">⚠ {landingAuthErrors.schoolName}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Representative / Admin Name <span className="text-rose-400">*</span></label>
                      <input type="text" required placeholder="e.g. Teacher Harrison"
                        value={regRepName} onChange={e => setRegRepName(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500" />
                      {landingAuthErrors.repName && <p className="text-rose-400 text-[10px] mt-0.5 font-mono">⚠ {landingAuthErrors.repName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Student Volume</label>
                        <input type="number" min={1} max={5000} value={regStudentVolume}
                          onChange={e => setRegStudentVolume(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Billing Cycle</label>
                        <div className="flex gap-1.5">
                          <button type="button" onClick={() => setRegBillingCycle("Monthly")}
                            className={`flex-1 py-2 text-[10px] font-bold rounded-lg border transition ${regBillingCycle === "Monthly" ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-900 border-slate-700 text-slate-400"}`}>
                            Monthly
                          </button>
                          <button type="button" onClick={() => setRegBillingCycle("Yearly")}
                            className={`flex-1 py-2 text-[10px] font-bold rounded-lg border transition ${regBillingCycle === "Yearly" ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-900 border-slate-700 text-slate-400"}`}>
                            Yearly
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">School Access Code (Optional)</label>
                      <input type="text" placeholder="e.g. W-ROSTER-2026"
                        value={schoolEnrollCode} onChange={e => setSchoolEnrollCode(e.target.value.toUpperCase())}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 uppercase tracking-widest font-mono" />
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">
                      💰 Est. cost: ${(regStudentVolume * 12 * (regBillingCycle === "Yearly" ? 12 : 1)).toLocaleString()} {regBillingCycle === "Yearly" ? "/ Year" : "/ Month"} ($12/student)
                    </p>
                  </div>
                )}

                {/* ─── Email ─── */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Email Address <span className="text-rose-400">*</span></label>
                  <input type="email" required
                    placeholder={landingAuthRole === "institution" ? "e.g. admin@school.edu" : "e.g. student@school.edu"}
                    value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                    onBlur={onBlurEmail}
                    className={`w-full rounded-xl bg-slate-900 border px-3.5 py-2.5 text-xs text-white focus:outline-none ${landingAuthErrors.email ? "border-rose-500 focus:border-rose-400" : "border-slate-700 focus:border-blue-500"}`} />
                  {landingAuthErrors.email && <p className="text-rose-400 text-[10px] mt-0.5 font-mono">⚠ {landingAuthErrors.email}</p>}
                </div>

                {/* ─── Password ─── */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Password <span className="text-rose-400">*</span></label>
                  <input type="password" required
                    placeholder={landingAuthMode === "register" ? "Create a password (min 6 characters)" : "Enter your password"}
                    value={loginAccessKey} onChange={e => setLoginAccessKey(e.target.value)}
                    onBlur={onBlurPassword}
                    className={`w-full rounded-xl bg-slate-900 border px-3.5 py-2.5 text-xs text-white focus:outline-none font-mono ${landingAuthErrors.password ? "border-rose-500 focus:border-rose-400" : "border-slate-700 focus:border-blue-500"}`} />
                  {landingAuthErrors.password && <p className="text-rose-400 text-[10px] mt-0.5 font-mono">⚠ {landingAuthErrors.password}</p>}
                  {landingAuthMode === "register" && loginAccessKey.length > 0 && !landingAuthErrors.password && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className={`h-1 flex-1 rounded-full ${loginAccessKey.length >= 6 ? "bg-emerald-500" : "bg-slate-700"}`} />
                      <div className={`h-1 flex-1 rounded-full ${loginAccessKey.length >= 8 ? "bg-emerald-500" : "bg-slate-700"}`} />
                      <div className={`h-1 flex-1 rounded-full ${loginAccessKey.length >= 12 ? "bg-emerald-500" : "bg-slate-700"}`} />
                      <span className="text-[9px] text-slate-500 font-mono ml-1">
                        {loginAccessKey.length < 6 ? "Weak" : loginAccessKey.length < 8 ? "Fair" : loginAccessKey.length < 12 ? "Strong" : "Very Strong"}
                      </span>
                    </div>
                  )}
                </div>

                {/* ─── Submit button ─── */}
                <button type="submit" disabled={tursoLoading}
                  className={`w-full py-3 h-11 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-lg transition active:scale-98 flex items-center justify-center gap-1.5 text-white mt-4 disabled:opacity-50 disabled:cursor-not-allowed ${landingAuthMode === "login"
                    ? (landingAuthRole === "institution" ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20" : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20")
                    : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"}`}>
                  {tursoLoading
                    ? (landingAuthMode === "login" ? "Signing in..." : "Creating account...")
                    : (landingAuthMode === "login" ? "Sign In" : "Create Account")}
                  {!tursoLoading && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </form>
            </div>
            <p className="text-[10px] text-slate-500 text-center mt-3 leading-snug">
              Secured by standard SHA-256 client credentials. All curriculum logs and active student score charts store temporarily inside direct client state.<br />
              For support, contact: stellar.foundation.us@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* Strategic Pillars */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="text-xs uppercase tracking-widest font-mono text-blue-400 font-extrabold">Executive Summary</h3>
          <h4 className="text-2xl sm:text-3xl font-extrabold text-white uppercase">A Complete Educational Ecosystem</h4>
          <p className="text-xs sm:text-sm text-slate-400 font-light">The Water Classroom democratizes access to high-quality education. By integrating cutting-edge artificial intelligence with comprehensive curriculum alignment, we bridge educational gaps and empower K-12 to undergraduate learners globally.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <Compass className="w-6 h-6" />, title: "AI-Tailored Curriculum", desc: "Dynamic lessons aligned with national and international standards, adaptable to individual learning paces and styles. Interactive multimedia content and games are designed to supercharge the learning experience.", color: "blue" },
            { icon: <Cpu className="w-6 h-6 animate-pulse" />, title: "24/7 AI Tutoring & Homework", desc: "Our AI tutors offer step-by-step teaching, real-time feedback, and guidance. Advanced automated grading algorithms provide actionable insights for both students and educators around the clock.", color: "cyan" },
            { icon: <Building className="w-6 h-6" />, title: "Innovation & Creativity Labs", desc: "Project-based learning modules connect core concepts to real-world scenarios. Engage in gamified engineering challenges and creative problem-solving to foster critical thinking and boundless imagination.", color: "indigo" },
            { icon: <Calculator className="w-6 h-6 animate-pulse" />, title: "Progress Analytics Dashboard", desc: "Users can rigorously track academic performance, engagement streaks, and skill development. Generates customizable, detailed growth reports for teachers, parents, and administrative oversight.", color: "emerald" },
            { icon: <Heart className="w-6 h-6" />, title: "Collaborative Learning Ecosystem", desc: "The platform includes seamlessly integrated virtual classrooms, moderated peer discussion forums, and dedicated educator tools, crafting a shared environment for robust curriculum management.", color: "rose" },
          ].map((pillar, idx) => (
            <div key={idx} className={`frosted-glass rounded-2xl p-6 shadow-lg space-y-4 transition-all duration-300 hover:scale-102 ${idx === 4 ? "lg:col-span-2 lg:flex lg:gap-6 lg:items-center lg:space-y-0" : ""}`}>
              <div className={`w-12 h-10 rounded-xl bg-${pillar.color}-950/50 border border-${pillar.color}-400/30 flex items-center justify-center text-${pillar.color}-400 ${idx === 4 ? "lg:w-16 lg:h-16 shrink-0" : ""}`}>
                {pillar.icon}
              </div>
              <div className={idx === 4 ? "space-y-1" : "space-y-4"}>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">{pillar.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline */}
      <div className="frosted-glass rounded-3xl p-6 sm:p-10 border border-blue-900/30 shadow-xl space-y-8">
        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-widest font-mono text-blue-400 font-bold">THE INTAKE PIPELINE</h3>
          <h4 className="text-xl sm:text-2xl font-extrabold text-white uppercase">The 4-Step Student Journey</h4>
          <p className="text-xs text-slate-400 max-w-xl">Whether you are enrolling as a private homeschool student or a classroom group, our pipeline takes you from zero to verifiable credentialing.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[
            { step: "01", title: "Select a Curriculum Track", desc: "Choose your primary curriculum (e.g. U.S. Common Core, UK GCSE, IB) or use a school invite code." },
            { step: "02", title: "Interactive Lectures & Games", desc: "Access the Open Academy for fun, AI-delivered multimedia lessons and games tailored to your curriculum." },
            { step: "03", title: "24/7 AI Tutor & Innovation Labs", desc: "Solve real-world homework challenges with our 24/7 AI Socratic Companion, adapting to gifted and struggling learners alike." },
            { step: "04", title: "Verified Exams & Badges", desc: "Complete automated assessments and secure exams via camera to earn Achievement Badges and maintain Learning Streaks." }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-950/40 p-5 rounded-xl border border-blue-950 flex flex-col justify-between space-y-3 relative overflow-hidden group">
              <div className="absolute right-0 top-0 text-[5rem] font-bold text-blue-500/5 select-none font-mono -mt-6 leading-none transition duration-350 group-hover:text-blue-500/10">{item.step}</div>
              <div className="space-y-1 z-10">
                <span className="text-[10px] font-mono text-blue-400 font-extrabold uppercase bg-blue-950 border border-blue-900/40 px-2 py-0.5 rounded">STEP {item.step}</span>
                <h5 className="font-extrabold text-white text-sm pt-1">{item.title}</h5>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-light z-10">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div id="prices-section" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest font-mono text-cyan-400 font-extrabold">STUDENT PLANS & SUBSCRIPTIONS</span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase">Choose Your Path</h3>
          <p className="text-xs text-slate-400">Every student deserves the right tools for their learning journey.</p>
        </div>
        {/* Billing toggle for student plans */}
        <div className="flex items-center justify-center gap-2 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800 max-w-[280px] mx-auto mb-6">
          <button onClick={() => setStudentBillingCycle("monthly")}
            className={`px-5 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition ${studentBillingCycle === "monthly" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
          >Monthly Billing</button>
          <button onClick={() => setStudentBillingCycle("yearly")}
            className={`px-5 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition ${studentBillingCycle === "yearly" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
          >Yearly Billing <span className="text-emerald-400 text-[8px]">Save ~17%</span></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Water Student — $19/mo or $190/yr */}
          <div className="bg-blue-950/20 border-2 border-blue-600/50 rounded-2xl p-5 space-y-3 flex flex-col justify-between relative shadow-lg group hover:border-blue-400 transition">
            <div className="absolute -top-2.5 right-3 bg-blue-600 text-[7px] text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Certificate Track</div>
            <div className="space-y-2.5">
              <span className="text-2xl">🌊</span>
              <h4 className="text-base font-bold text-white uppercase">Water Student</h4>
              <p className="text-[10px] text-blue-200 leading-relaxed font-light">Homeschool with official proctored exams and a valid school certificate.</p>
              <div className="py-1">
                {studentBillingCycle === "yearly" ? (
                  <>
                    <strong className="text-3xl font-extrabold text-blue-400 font-mono">$190</strong>
                    <span className="text-[10px] text-slate-300 ml-1 font-mono">/ Year <span className="text-emerald-400 text-[9px]">(Save $38)</span></span>
                  </>
                ) : (
                  <>
                    <strong className="text-3xl font-extrabold text-blue-400 font-mono">$19</strong>
                    <span className="text-[10px] text-slate-300 ml-1 font-mono">/ Month</span>
                  </>
                )}
              </div>
              <ul className="text-[10px] text-slate-300 space-y-1.5 pt-2 border-t border-blue-900/30 leading-relaxed">
                <li className="flex items-center gap-1.5"><span className="text-blue-400 font-semibold">✓</span> Verified proctored exams</li>
                <li className="flex items-center gap-1.5"><span className="text-blue-400 font-semibold">✓</span> Valid school certificate / diploma</li>
                <li className="flex items-center gap-1.5"><span className="text-blue-400 font-semibold">✓</span> Full curriculum & 24/7 AI tutor</li>
                <li className="flex items-center gap-1.5"><span className="text-blue-400 font-semibold">✓</span> Robotics labs & progress analytics</li>
              </ul>
            </div>
            <a href="#auth-section" onClick={() => setLandingAuthRole("water-student")} className="block w-full py-2 bg-blue-600 hover:bg-blue-500 text-center text-[10px] font-extrabold uppercase rounded-xl text-white shadow-lg transition mt-2 no-underline">
              Enroll — {studentBillingCycle === "yearly" ? "$190/yr" : "$19/mo"}
            </a>
          </div>

          {/* Independent Student — $15/mo or $150/yr */}
          <div className="bg-emerald-950/15 border-2 border-emerald-700/40 rounded-2xl p-5 space-y-3 flex flex-col justify-between relative shadow-lg group hover:border-emerald-500 transition">
            <div className="absolute -top-2.5 right-3 bg-emerald-700 text-[7px] text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Study Aid</div>
            <div className="space-y-2.5">
              <span className="text-2xl">🎓</span>
              <h4 className="text-base font-bold text-white uppercase">Independent</h4>
              <p className="text-[10px] text-emerald-200 leading-relaxed font-light">AI tutoring, curriculum access, and tools to help you ace your existing school.</p>
              <div className="py-1">
                {studentBillingCycle === "yearly" ? (
                  <>
                    <strong className="text-3xl font-extrabold text-emerald-400 font-mono">$150</strong>
                    <span className="text-[10px] text-slate-300 ml-1 font-mono">/ Year <span className="text-emerald-400 text-[9px]">(Save $30)</span></span>
                  </>
                ) : (
                  <>
                    <strong className="text-3xl font-extrabold text-emerald-400 font-mono">$15</strong>
                    <span className="text-[10px] text-slate-300 ml-1 font-mono">/ Month</span>
                  </>
                )}
              </div>
              <ul className="text-[10px] text-slate-300 space-y-1.5 pt-2 border-t border-emerald-900/30 leading-relaxed">
                <li className="flex items-center gap-1.5"><span className="text-emerald-400 font-semibold">✓</span> Full curriculum access</li>
                <li className="flex items-center gap-1.5"><span className="text-emerald-400 font-semibold">✓</span> 24/7 AI tutor & homework help</li>
                <li className="flex items-center gap-1.5"><span className="text-emerald-400 font-semibold">✓</span> Interactive labs & games</li>
                <li className="flex items-center gap-1.5"><span className="text-slate-500">✗</span> No proctored exams or diploma</li>
              </ul>
            </div>
            <a href="#auth-section" onClick={() => setLandingAuthRole("independent-student")} className="block w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-center text-[10px] font-extrabold uppercase rounded-xl text-white shadow-lg transition mt-2 no-underline">
              Enroll — {studentBillingCycle === "yearly" ? "$150/yr" : "$15/mo"}
            </a>
          </div>

          {/* School Student — $12/mo or $120/yr (billed to school) */}
          <div className="bg-amber-950/15 border-2 border-amber-700/40 rounded-2xl p-5 space-y-3 flex flex-col justify-between relative shadow-lg group hover:border-amber-500 transition">
            <div className="absolute -top-2.5 right-3 bg-amber-700 text-[7px] text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Sponsored</div>
            <div className="space-y-2.5">
              <span className="text-2xl">🏫</span>
              <h4 className="text-base font-bold text-white uppercase">School Student</h4>
              <p className="text-[10px] text-amber-200 leading-relaxed font-light">Signed up by your school. Full resources to help you learn and become a great student.</p>
              <div className="py-1">
                <strong className="text-3xl font-extrabold text-amber-400 font-mono">$12</strong>
                <span className="text-[10px] text-slate-300 ml-1 font-mono">/ Student / Month</span>
                <br />
                <span className="text-[9px] text-slate-500 block mt-0.5">Volume pricing — billed directly to your school</span>
              </div>
              <ul className="text-[10px] text-slate-300 space-y-1.5 pt-2 border-t border-amber-900/30 leading-relaxed">
                <li className="flex items-center gap-1.5"><span className="text-amber-400 font-semibold">✓</span> Full Water Classroom resources</li>
                <li className="flex items-center gap-1.5"><span className="text-amber-400 font-semibold">✓</span> 24/7 AI tutor & progress tracking</li>
                <li className="flex items-center gap-1.5"><span className="text-amber-400 font-semibold">✓</span> Curriculum-aligned content</li>
                <li className="flex items-center gap-1.5"><span className="text-slate-500">✗</span> No proctored exams or diploma</li>
              </ul>
            </div>
            <a href="#auth-section" onClick={() => setLandingAuthRole("water-student")} className="block w-full py-2 bg-amber-700 hover:bg-amber-600 text-center text-[10px] font-extrabold uppercase rounded-xl text-white shadow-lg transition mt-2 no-underline">
              Refer Water Classroom to Your School →
            </a>
          </div>

          {/* Institution — custom pricing */}
          <div className="bg-indigo-950/15 border-2 border-indigo-700/40 rounded-2xl p-5 space-y-3 flex flex-col justify-between relative shadow-lg group hover:border-indigo-400 transition">
            <div className="absolute -top-2.5 right-3 bg-indigo-700 text-[7px] text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Bulk</div>
            <div className="space-y-2.5">
              <span className="text-2xl">🏛️</span>
              <h4 className="text-base font-bold text-white uppercase">Institution</h4>
              <p className="text-[10px] text-indigo-200 leading-relaxed font-light">For schools, co-ops, and microschools deploying at scale.</p>
              <div className="py-1">
                <strong className="text-3xl font-extrabold text-indigo-400 font-mono">$12</strong>
                <span className="text-[10px] text-slate-300 ml-1 font-mono">/ Student / Month</span>
                <br />
                <strong className="text-xl font-extrabold text-indigo-400 font-mono">$144</strong>
                <span className="text-[10px] text-slate-300 ml-1 font-mono">/ Student / Year</span>
              </div>
              <ul className="text-[10px] text-slate-300 space-y-1.5 pt-2 border-t border-indigo-900/30 leading-relaxed">
                <li className="flex items-center gap-1.5"><span className="text-indigo-400 font-semibold">✓</span> Bulk student deployments</li>
                <li className="flex items-center gap-1.5"><span className="text-indigo-400 font-semibold">✓</span> Admin dashboard & roster tools</li>
                <li className="flex items-center gap-1.5"><span className="text-indigo-400 font-semibold">✓</span> Custom configuration & reports</li>
                <li className="flex items-center gap-1.5"><span className="text-indigo-400 font-semibold">✓</span> Priority support & onboarding</li>
              </ul>
            </div>
            <a href="#auth-section" onClick={() => setLandingAuthRole("institution")} className="block w-full py-2 bg-indigo-700 hover:bg-indigo-600 text-center text-[10px] font-extrabold uppercase rounded-xl text-white shadow-lg transition mt-2 no-underline">Configure — $12/stud</a>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact-section" className="frosted-glass rounded-3xl p-6 sm:p-8 border border-blue-900/20 shadow-2xl relative">
        <div className="absolute right-4 top-4 text-blue-500 opacity-5 pointer-events-none"><Calculator className="w-36 h-36" /></div>
        <div className="relative z-10 space-y-8 animate-fade-in">
          <div className="space-y-2 text-center max-w-3xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-mono text-blue-400 font-bold bg-blue-950 border border-blue-900/40 px-3 py-1 rounded">Institutional Portal & Rate Estimation</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase leading-tight">Display Plans for Schools & Custom Co-Ops</h3>
            <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">Water Classroom scales effortlessly. Our institutional pricing calculates at <strong className="text-blue-400">$12 per student per month</strong>.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
            <div className="lg:col-span-7 bg-slate-950/60 p-6 rounded-2xl border border-blue-900/30 flex flex-col justify-between">
              <div className="space-y-4">
                <h4 className="text-md font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-400" /> School License Price Estimator
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">Determine licensing parameters. Pricing computes flatly at USD $12 per student per month.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Planned Students</label>
                    <input type="number" value={calcStudents} onChange={e => setCalcStudents(Math.max(1, parseInt(e.target.value) || 0))}
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Billing Cycle</label>
                    <div className="flex gap-2">
                      <button onClick={() => setCalcBilling("yearly")} className={`flex-grow py-1.5 text-xs font-bold rounded-lg border transition ${calcBilling === "yearly" ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-900 border-slate-700 text-slate-400"}`}>Yearly ($144/stud)</button>
                      <button onClick={() => setCalcBilling("monthly")} className={`flex-grow py-1.5 text-xs font-bold rounded-lg border transition ${calcBilling === "monthly" ? "bg-indigo-600 text-white border-indigo-500" : "bg-slate-900 border-slate-700 text-slate-400"}`}>Monthly ($12/stud)</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center bg-indigo-950/20 p-4 rounded-xl border border-indigo-900/20 gap-4 mt-6">
                <div>
                  <span className="text-[10px] uppercase font-mono text-indigo-300 font-bold block">Estimated Licensing Fee</span>
                  <strong className="text-2xl font-extrabold text-[#818cf8] font-mono">${calculateInstitutionalBulkCost().toLocaleString()} USD</strong>
                  <span className="text-[9px] text-[#a5b4fc] block font-mono">{calcBilling === "yearly" ? "Billed annually" : "Billed monthly"} at flat $12 per student / month.</span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1" />
            <div className="lg:col-span-4 bg-[#0b1c36]/30 border border-blue-900/30 p-6 rounded-2xl flex flex-col justify-between">
              <form onSubmit={executeSendMessage} className="space-y-4">
                <h4 className="text-md font-bold text-white uppercase tracking-wider">💌 Contact Registrar Desk</h4>
                {contactConfirmed ? (
                  <div className="bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 rounded-xl p-4 text-xs space-y-2 animate-fade-in leading-relaxed">
                    <span className="font-bold text-white block text-[10px] uppercase font-mono tracking-wider">✓ Setup Request Sent</span>
                    Your custom configuration request is saved. Support will respond within 12 hours.
                  </div>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Representative Name</label>
                      <input type="text" required placeholder="e.g. Principal Rogers" value={contactName} onChange={e => setContactName(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Official School E-mail</label>
                      <input type="email" required placeholder="e.g. rogers@charteracademy.org" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Requirements</label>
                      <textarea required rows={3} placeholder="Detail your classroom volume, tracking rules, custom preferences..." value={contactMsg} onChange={e => setContactMsg(e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 resize-none" />
                    </div>
                    {contactErrorMsg && <div className="text-rose-400 text-[10px] p-2 bg-rose-950/50 border border-rose-900/50 rounded font-mono">⚠ {contactErrorMsg}</div>}
                    <button type="submit" disabled={isSendingContact}
                      className={`w-full py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition block ${isSendingContact ? 'bg-indigo-900/50 text-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer'}`}>
                      {isSendingContact ? sendingStatus || "Sending..." : "Submit Support Request"}
                    </button>
                  </>
                )}
              </form>
              <div className="border-t border-slate-800/80 pt-4 mt-4 text-[10px] text-slate-400 space-y-1">
                <p><strong>Email:</strong> stellar.foundation.us@gmail.com</p>
                <p><strong>Tel / WhatsApp:</strong> +55 81 99395-3560</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-white uppercase tracking-tight text-center">Frequently Asked Questions (FAQ)</h3>
        <p className="text-xs text-slate-400 text-center max-w-xl mx-auto -mt-2">Have questions about the platform? Read our FAQs below.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {[
            { q: "How does the Water Classroom Socratic Companion tutor students?", a: "Our AI Tutor utilizes deep inquiry pedagogy. Instead of simple answer-spitting, the Socratic Tutor asks prompting questions, asks students to elaborate, and guides them step-by-step." },
            { q: "How does the browser-based Proctor exam verification work?", a: "The voluntary exam verification utilizes the client's local computer camera purely client-side to track eye vectors, facial presence, and ambient volumes. This secures academic integrity transparently." },
            { q: "What curriculum metrics are mapped inside the Academy?", a: "Water Classroom lessons map to top global criteria, including K-12 US Common Core, UK GCSE, and International Baccalaureate (IB) frameworks." },
            { q: "How do homeschooling parents track and submit grades?", a: "Parent mentors can set up a custom administrator registry, link student nodes, track points, and download cumulative grade sheets as portable CSV documents." },
            { q: "Can high-schoolers obtain STEM credits through robotics sims?", a: "Yes. Our mechanical simulation games are formulated using actual physics values. Passing exam scores on these tasks awards certified transcript badges." },
            { q: "Is there any cost for self-taught or struggling individual students?", a: "Zero cost for basic reading access, forum participation, and standard simulation attempts, sponsored through the Stellarium Foundation grant program." },
            { q: "What licensing options are structured for custom co-ops?", a: "School plans for $12 per student per month (or $144/year under bulk agreements). Includes bulk student deployments, custom dashboards, and automated registry tools." },
            { q: "Is student user data privately protected?", a: "Absolutely. All session tokens, passcodes, and student logs remain fully secure inside the local browser context. No external marketing surveillance can access user progression." },
            { q: "Can our homeschool group register as an institution split across multiple regions?", a: "Yes! The system supports co-ops, microschools, and academies of any size. A shareable Access Key is generated for global registration." },
            { q: "How do individual student registration tracks differ?", a: "Water Students ($19/mo) get verified proctored exams and a valid school certificate — ideal for homeschoolers. Independent Students ($15/mo) get full curriculum access, AI tutoring, and labs but no proctored exams or diploma. School Students ($12/mo, sponsored by their school) get the same full resources as Independent, without exams." },
            { q: "What does a Water School Student get that others don't?", a: "Water School Students receive fully verified proctored exams with browser-based camera proctoring and a valid Water Classroom school certificate/diploma. This is designed for homeschool families seeking accredited credentialing." },
            { q: "Are there any hidden setup fees, API fees, or LMS surcharges?", a: "No. Every registered institution plan receives full grading databases, local roster sync, and direct support services for a flat $12/student/month." },
            { q: "Which payment options are accepted?", a: "All math and invoices correspond with standard USD. No immediate payment method is required to configure a school plan or independent student login profile." }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-950/40 rounded-xl border border-blue-900/20 overflow-hidden">
              <button onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-blue-950/50 transition duration-200">
                <span className="font-bold text-white text-xs sm:text-sm leading-snug">{item.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedFaq === idx ? "transform rotate-180" : ""}`} />
              </button>
              {expandedFaq === idx && (
                <div className="px-5 pb-4 text-[11px] sm:text-xs text-slate-300 leading-relaxed border-t border-blue-900/10 pt-3 bg-slate-900/30 font-light">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-950/60 pt-12 pb-8 text-xs text-slate-400 space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-900 border border-blue-500/20 flex items-center justify-center text-[10px] font-extrabold text-blue-400">W</div>
              <span className="font-extrabold text-white tracking-wider uppercase font-mono">WATER CLASSROOM</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-light">The world-first open decentralized classroom registry. Delivering K-12 and undergraduate homeschool acceleration powered by Socratic AI.</p>
            <p className="text-[10px] text-slate-500 font-mono pt-1">LEDGER STATUS: COMPLIANT<br />SWISS BUREAU ID: CH-200.3.011</p>
          </div>
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">CURRICULUM</h5>
            <ul className="space-y-2 text-[11px] text-slate-400 font-light">
              <li><a href="#auth-section" className="hover:text-blue-400 transition">U.S. Common Core</a></li>
              <li><a href="#auth-section" className="hover:text-blue-400 transition">UK GCSE & A-Level</a></li>
              <li><a href="#auth-section" className="hover:text-blue-400 transition">International Baccalaureate</a></li>
              <li><a href="#auth-section" className="hover:text-blue-400 transition">Swiss Maturité</a></li>
              <li><a href="#auth-section" className="hover:text-blue-400 transition">Socrates Creed</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">SCHOOLS</h5>
            <ul className="space-y-2 text-[11px] text-slate-400 font-light">
              <li><a href="#contact-section" className="hover:text-indigo-400 transition">Configure School Plan</a></li>
              <li><a href="#contact-section" className="hover:text-indigo-400 transition">Rate Calculator</a></li>
              <li><a href="#auth-section" className="hover:text-indigo-400 transition">Access Key Deployments</a></li>
              <li><a href="#contact-section" className="hover:text-indigo-400 transition">Roster Registry Tools</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">STELLARIUM FOUNDATION</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed font-light">A registered non-profit promoting global knowledge access, decentralized ledgers, and free STEM sandboxes.</p>
            <p className="text-[10px] text-slate-500 font-mono">US Registry ID: DE-6421-ST<br />Swiss ID: CH-200.3.011.455-8</p>
          </div>
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">SUPPORT</h5>
            <div className="text-[11px] text-slate-400 space-y-2 font-mono">
              <p>Email: stellar.foundation.us@gmail.com</p>
              <p className="text-[10px] leading-tight text-slate-500 font-light">Address: 50760-310, 223 - Brazil</p>
              <p className="text-[10px] text-slate-500">Tel / WhatsApp: +55 81 99395-3560</p>
              <p className="pt-2">
                <a href="https://www.stellarium.ddns-ip.net/" target="_blank" rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline transition">
                  Stellarium ↗
                </a>
                <span className="mx-2 text-slate-600">|</span>
                <a href="https://water-enterprises-landing.onrender.com/" target="_blank" rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline transition">
                  Water Enterprises ↗
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-950/40 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 gap-4">
          <p>© 2026 Water Classroom Global & Stellarium Foundation, Inc. All rights reserved.</p>
          <div className="flex gap-4 font-mono select-none">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> SHA-256 LEDGER: [VERIFIED]</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> MONERO GATEWAY: [ON-LINE]</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
