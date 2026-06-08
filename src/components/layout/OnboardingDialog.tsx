import { useApp } from "../../contexts/AppContext";
import { Globe, Compass, GraduationCap, BookOpen, ShieldCheck, ArrowLeft, ChevronRight, Check, MapPin } from "lucide-react";
import { COUNTRIES, getFilteredPrograms, getFilteredCategories, PROGRAMS, getCountryGradeLevels, getCountryStages, STUDENT_TRACKS } from "../../curriculumData";

export default function OnboardingDialog() {
  const {
    onboardingStep, setOnboardingStep,
    isOnboardingComplete, setIsOnboardingComplete,
    studentCountry, setStudentCountry,
    studentTrackType, setStudentTrackType,
    studentProgramId, setStudentProgramId,
    studentGradeLevelId, setStudentGradeLevelId,
    enrollmentType, setEnrollmentType,
    schoolEnrollCode, setSchoolEnrollCode,
    isOnboarded, setIsOnboarded,
    studentBillingCycle, setStudentBillingCycle,
    isUserActivated, loginEmail,
    handleOnboardingNext, handleOnboardingBack,
    setOnboardingCurriculum,
    setLandingAuthRole,
  } = useApp();

  // Show if: user is logged in AND (not onboarded OR onboarding not complete)
  const shouldShow = (!isOnboarded || (!isOnboardingComplete && !isUserActivated));
  if (!shouldShow) return null;

  const totalSteps = 6;
  const selectedCountry = COUNTRIES.find(c => c.code === studentCountry);
  const filteredPrograms = studentCountry ? getFilteredPrograms(studentCountry) : [];
  const filteredCategories = studentCountry ? getFilteredCategories(studentCountry) : [];
  const selectedProgram = PROGRAMS.find(p => p.id === studentProgramId);
  const countryGradeLevels = studentCountry ? getCountryGradeLevels(studentCountry) : [];
  const countryStages = studentCountry ? getCountryStages(studentCountry) : [];
  const selectedGrade = countryGradeLevels.find(g => g.id === studentGradeLevelId);
  const selectedStage = countryStages.find(s => s.key === selectedGrade?.stage);
  const selectedTrack = STUDENT_TRACKS.find(t => t.id === studentTrackType);

  // Clear onboarding localStorage on completion
  const clearOnboardingState = () => {
    try { localStorage.removeItem("wc_onboarding_state"); } catch { /* ignore */ }
  };

  // Determine pricing
  const trackPricing = (trackId: string, yearly: boolean) => {
    if (trackId === "water-student") return yearly ? "$190/yr" : "$19/mo";
    if (trackId === "independent-student") return yearly ? "$150/yr" : "$15/mo";
    if (trackId === "school-student") return yearly ? "$120/yr" : "$12/mo";
    return "";
  };

  const handleConfirmAndPay = async () => {
    // Save onboarding state
    setIsOnboarded(true);
    setIsOnboardingComplete(true);
    if (selectedProgram) setOnboardingCurriculum(selectedProgram.name);
    if (studentTrackType) setLandingAuthRole(studentTrackType as any);
    
    // Map track to server type
    let serverType = "Water Student";
    let serverKind = "Water School Homeschool";
    if (studentTrackType === "independent-student") {
      serverType = "Independent Student";
      serverKind = "Self-Directed Learner";
    } else if (studentTrackType === "school-student") {
      serverType = "School Student";
      serverKind = "School-Enrolled Learner";
    } else if (studentTrackType === "water-student") {
      serverType = "Water Student";
      serverKind = "Water School Homeschool";
    }

    // Update user record on server with onboarding info
    try {
      await fetch("/api/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          type: serverType,
          kindOfSchool: serverKind,
          country: studentCountry,
          academicTrack: selectedProgram?.name || "General",
          gradeLevel: selectedGrade?.name || "",
          enrollmentType,
          billingCycle: studentBillingCycle === "yearly" ? "Yearly" : "Monthly",
        })
      });
    } catch { /* server update is best-effort */ }

    clearOnboardingState();

    // Redirect to Stripe payment
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          type: studentTrackType,
          billingCycle: studentBillingCycle,
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Stripe not configured — just continue to dashboard
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="frosted-glass-dark p-5 sm:p-8 rounded-3xl max-w-2xl w-full border border-blue-500/20 space-y-6 my-4">
        
        {/* ─── Step Progress ─── */}
        <div className="flex items-center justify-between gap-1 mb-2">
          {[1, 2, 3, 4, 5, 6].map(step => (
            <div key={step} className="flex items-center gap-1 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                onboardingStep === step
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-110"
                  : onboardingStep > step
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-slate-500"
              }`}>
                {onboardingStep > step ? <Check className="w-3 h-3" /> : step}
              </div>
              {step < 6 && <div className={`flex-1 h-0.5 rounded ${onboardingStep > step ? "bg-emerald-600" : "bg-slate-800"}`} />}
            </div>
          ))}
        </div>

        {/* ─── Step 1: Select Country ─── */}
        {onboardingStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-indigo-950 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 mx-auto">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Where Are You Located?</h3>
              <p className="text-xs text-slate-400">Select your country so we can show you the right curriculum options. Different countries have different educational standards and homeschooling laws.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
              {COUNTRIES.map(c => (
                <button
                  key={c.code}
                  onClick={() => { setStudentCountry(c.code); setStudentProgramId(""); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs transition border ${
                    studentCountry === c.code
                      ? "bg-indigo-600/20 border-indigo-500 text-white"
                      : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <span className="text-lg">{c.flag}</span>
                  <div className="text-left">
                    <span className="font-bold block text-[11px]">{c.name}</span>
                    <span className="text-[9px] text-slate-500">{c.categories.length} program categories</span>
                  </div>
                  {studentCountry === c.code && <Check className="w-4 h-4 text-indigo-400 ml-auto shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── Step 2: Select Student Track / Type ─── */}
        {onboardingStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-blue-950 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400 mx-auto">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Choose Your Student Track</h3>
              <p className="text-xs text-slate-400">Select the type of learning experience that fits your needs.</p>
              {selectedCountry && (
                <span className="inline-block px-2.5 py-1 text-[9px] font-mono bg-indigo-950 text-indigo-300 rounded-full border border-indigo-800/50">
                  {selectedCountry.flag} {selectedCountry.name}
                </span>
              )}
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
              {STUDENT_TRACKS.map(track => (
                <button
                  key={track.id}
                  onClick={() => setStudentTrackType(track.id)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    studentTrackType === track.id
                      ? track.id === "water-student" ? "bg-blue-600/15 border-blue-500 text-white" :
                        track.id === "independent-student" ? "bg-emerald-600/15 border-emerald-500 text-white" :
                        "bg-amber-600/15 border-amber-500 text-white"
                      : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-sm font-bold block">{track.label}</span>
                      <span className="text-[10px] text-slate-400 block">{track.desc}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold font-mono block">{trackPricing(track.id, studentBillingCycle === "yearly")}</span>
                      <span className="text-[8px] text-slate-400 capitalize">{studentBillingCycle}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {track.features.map((f, i) => (
                      <span key={i} className={`px-1.5 py-0.5 text-[8px] rounded-full border ${
                        track.id === studentTrackType
                          ? "border-current opacity-70" : "border-slate-700 text-slate-500"
                      }`}>
                        {f.startsWith("✓") ? f : `✓ ${f}`}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Billing toggle for students */}
            {studentTrackType && (
              <div className="flex items-center justify-center gap-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800 max-w-[220px] mx-auto">
                <button onClick={() => setStudentBillingCycle("monthly")}
                  className={`px-3 py-1.5 text-[9px] font-bold rounded-lg uppercase tracking-wider transition ${studentBillingCycle === "monthly" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                >Monthly</button>
                <button onClick={() => setStudentBillingCycle("yearly")}
                  className={`px-3 py-1.5 text-[9px] font-bold rounded-lg uppercase tracking-wider transition ${studentBillingCycle === "yearly" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"}`}
                >Yearly <span className="text-emerald-400 text-[7px]">Save 17%</span></button>
              </div>
            )}
          </div>
        )}

        {/* ─── Step 3: Select Program / Curriculum (filtered by country) ─── */}
        {onboardingStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-950 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Select Your Curriculum</h3>
              <p className="text-xs text-slate-400">Choose the educational program that matches your learning path.</p>
              {selectedCountry && (
                <span className="inline-block px-2.5 py-1 text-[9px] font-mono bg-indigo-950 text-indigo-300 rounded-full border border-indigo-800/50">
                  {selectedCountry.flag} {selectedCountry.name}
                </span>
              )}
              {selectedTrack && (
                <span className="inline-block px-2.5 py-1 text-[9px] font-mono bg-blue-950 text-blue-300 rounded-full border border-blue-800/50 ml-1">
                  {selectedTrack.label}
                </span>
              )}
            </div>
            
            {filteredPrograms.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                <Compass className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                <p>Please go back and select your country first.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                {filteredCategories.map(cat => {
                  const catPrograms = filteredPrograms.filter(p => p.category === cat.key);
                  if (catPrograms.length === 0) return null;
                  return (
                    <div key={cat.key} className="space-y-1">
                      <h4 className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 px-1 pt-2">{cat.label}</h4>
                      {catPrograms.map(p => (
                        <button
                          key={p.id}
                          onClick={() => setStudentProgramId(p.id)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition border ${
                            studentProgramId === p.id
                              ? "bg-emerald-600/20 border-emerald-500 text-white"
                              : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-600"
                          }`}
                        >
                          <span className="font-bold block text-[11px]">{p.name}</span>
                          <span className="text-[9px] text-slate-500">{p.description}</span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ─── Step 4: Select Grade / Stage (country-specific) ─── */}
        {onboardingStep === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-amber-950 border border-amber-500/30 rounded-full flex items-center justify-center text-amber-400 mx-auto">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Select Your Grade / Level</h3>
              <p className="text-xs text-slate-400">We've localized the grade names to match {selectedCountry?.flag} {selectedCountry?.name}'s education system.</p>
              {selectedProgram && (
                <span className="inline-block px-2.5 py-1 text-[9px] font-mono bg-emerald-950 text-emerald-300 rounded-full border border-emerald-800/50">
                  Curriculum: {selectedProgram.name}
                </span>
              )}
              {selectedCountry && countryStages.length === 0 && (
                <p className="text-xs text-amber-400">No grade data for this country. Please go back and select a different country.</p>
              )}
            </div>
            
            {countryStages.length > 0 ? (
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                {countryStages.map(stage => {
                  const stageGrades = countryGradeLevels.filter(g => g.stage === stage.key);
                  if (stageGrades.length === 0) return null;
                  return (
                    <div key={stage.key} className="space-y-1">
                      <h4 className="text-[10px] font-bold font-mono uppercase tracking-wider text-slate-500 px-1">
                        {stage.label}
                      </h4>
                      <p className="text-[8px] text-slate-600 px-1 -mt-0.5">{stage.description}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {stageGrades.map((g: any) => (
                          <button
                            key={g.id}
                            onClick={() => setStudentGradeLevelId(g.id)}
                            className={`px-3 py-2.5 rounded-lg text-[11px] font-bold text-center transition border ${
                              studentGradeLevelId === g.id
                                ? "bg-amber-600/20 border-amber-500 text-amber-300"
                                : "bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-600"
                            }`}
                          >
                            {g.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                <p>Please select your country first to see localized grade options.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── Step 5: Enrollment Type ─── */}
        {onboardingStep === 5 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-purple-950 border border-purple-500/30 rounded-full flex items-center justify-center text-purple-400 mx-auto">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">How Are You Enrolling?</h3>
              <p className="text-xs text-slate-400">Help us understand your learning setup so we can tailor the experience.</p>
            </div>

            <div className="space-y-3">
              {[
                { id: "independent", label: "Independent Student", desc: "Self-directed learner studying on my own", icon: "🎓" },
                { id: "homeschool", label: "Homeschooled", desc: "Learning at home with family / parent guidance", icon: "🏠" },
                { id: "school", label: "Enrolled at a School", desc: "I have a school enrollment code or access key", icon: "🏫" },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setEnrollmentType(opt.id)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    enrollmentType === opt.id
                      ? "bg-purple-600/15 border-purple-500 text-white"
                      : "bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <span className="text-sm font-bold block">
                    {opt.icon} {opt.label}
                  </span>
                  <span className="text-[10px] text-slate-500">{opt.desc}</span>
                </button>
              ))}

              {/* If "school" selected, show code field */}
              {enrollmentType === "school" && (
                <div className="animate-fade-in space-y-2 pt-2 border-t border-slate-800">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">
                    Enter School Enrollment Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. W-CLASS-2026"
                    value={schoolEnrollCode}
                    onChange={e => setSchoolEnrollCode(e.target.value.toUpperCase())}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 uppercase tracking-widest font-mono"
                  />
                </div>
              )}

              {enrollmentType === "homeschool" && (
                <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
                  <p>🏡 <strong className="text-slate-200">Homeschool Settings</strong></p>
                  <p>Dashboard configured for parent-guided learning with progress tracking and customizable lesson plans.</p>
                </div>
              )}

              {enrollmentType === "independent" && (
                <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800 text-[10px] text-slate-400 space-y-1">
                  <p>🎓 <strong className="text-slate-200">Independent Study Mode</strong></p>
                  <p>Full autonomy over your learning path with access to all curriculums, AI tutoring, and self-paced assessments.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── Step 6: Review & Complete + Payment Redirect ─── */}
        {onboardingStep === 6 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-950 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Review & Activate</h3>
              <p className="text-xs text-slate-400">Confirm your selections below, then proceed to secure checkout via Stripe.</p>
            </div>

            <div className="frosted-glass-dark p-5 rounded-2xl border border-blue-900/30 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Country</span>
                <span className="text-xs text-white font-bold text-right">{selectedCountry?.flag} {selectedCountry?.name || "Not selected"}</span>
              </div>
              <div className="border-t border-blue-900/20" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Student Track</span>
                <span className="text-xs text-white font-bold text-right">{selectedTrack?.label || "Not selected"}</span>
              </div>
              <div className="border-t border-blue-900/20" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Curriculum</span>
                <span className="text-xs text-white font-bold text-right">{selectedProgram?.name || "Not selected"}</span>
              </div>
              <div className="border-t border-blue-900/20" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Grade / Level</span>
                <span className="text-xs text-white font-bold text-right">
                  {selectedGrade?.name || "Not selected"}
                  {selectedStage && <span className="text-slate-400 text-[9px] block">({selectedStage.label})</span>}
                </span>
              </div>
              <div className="border-t border-blue-900/20" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Enrollment</span>
                <span className="text-xs text-white font-bold text-right capitalize">
                  {enrollmentType === "independent" ? "Independent Student" :
                   enrollmentType === "homeschool" ? "Homeschooled" :
                   enrollmentType === "school" ? `School (Code: ${schoolEnrollCode})` :
                   "Not specified"}
                </span>
              </div>
              <div className="border-t border-blue-900/20" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-mono text-slate-500 font-bold">Billing</span>
                <span className="text-xs text-white font-bold text-right capitalize">{studentBillingCycle}</span>
              </div>
              <div className="border-t border-blue-900/20 pt-2 mt-1" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-200">Total</span>
                <span className="text-emerald-400 font-bold font-mono text-lg">
                  {trackPricing(studentTrackType, studentBillingCycle === "yearly")}
                </span>
              </div>
            </div>

            <div className="bg-blue-950/20 border border-blue-500/20 p-4 rounded-xl text-[10px] text-slate-300 space-y-2">
              <p className="font-bold text-blue-300 text-[11px]">🔒 You're almost there!</p>
              <p>
                After confirming, you'll be redirected to Stripe's secure checkout to activate your {selectedTrack?.label || "account"}. 
                Your profile selections will be saved. Cancel anytime.
              </p>
            </div>
          </div>
        )}

        {/* ─── Navigation Buttons ─── */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
          {onboardingStep > 1 ? (
            <button onClick={handleOnboardingBack}
              className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs font-bold transition flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}
          
          {onboardingStep < totalSteps ? (
            <button
              onClick={handleOnboardingNext}
              disabled={
                (onboardingStep === 1 && !studentCountry) ||
                (onboardingStep === 2 && !studentTrackType) ||
                (onboardingStep === 3 && !studentProgramId) ||
                (onboardingStep === 4 && !studentGradeLevelId) ||
                (onboardingStep === 5 && !enrollmentType)
              }
              className="px-6 py-2.5 rounded-xl bg-blue-600 enabled:hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleConfirmAndPay}
              disabled={!studentCountry || !studentTrackType || !studentProgramId || !studentGradeLevelId || !enrollmentType}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 enabled:hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirm & Pay <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* ─── Step indicator text ─── */}
        <p className="text-[9px] text-slate-600 text-center font-mono">
          Step {onboardingStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
}
