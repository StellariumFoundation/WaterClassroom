import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { Users, GraduationCap, BarChart3, Settings, Plus, Trash2, Shield, ClipboardList, CreditCard, Download, TrendingUp, BookOpen } from "lucide-react";

interface RosterStudent {
  id: string;
  name: string;
  email: string;
  grade: string;
  curriculum: string;
  status: "active" | "invited" | "pending";
  lastActive: string;
  progress: number;
}

export default function SchoolDashboardPage() {
  const {
    loginEmail, onboardingCurriculum, studentName, landingAuthRole
  } = useApp();

  const [activeSection, setActiveSection] = useState<"overview" | "roster" | "analytics" | "settings">("overview");
  const [rosterStudents, setRosterStudents] = useState<RosterStudent[]>([
    { id: "s1", name: "Alice Vance", email: "alice@example.com", grade: "9th Grade", curriculum: "U.S. Common Core", status: "active", lastActive: "Today", progress: 72 },
    { id: "s2", name: "Bob Harrison", email: "bob@example.com", grade: "10th Grade", curriculum: "IB Diploma", status: "active", lastActive: "Yesterday", progress: 58 },
    { id: "s3", name: "Carol Smith", email: "carol@example.com", grade: "8th Grade", curriculum: "UK GCSE", status: "invited", lastActive: "-", progress: 0 },
    { id: "s4", name: "David Lee", email: "david@example.com", grade: "11th Grade", curriculum: "U.S. Common Core", status: "active", lastActive: "2 days ago", progress: 89 },
    { id: "s5", name: "Eva Martinez", email: "eva@example.com", grade: "7th Grade", curriculum: "U.S. Common Core", status: "pending", lastActive: "1 week ago", progress: 35 },
  ]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("");
  const [bulkImportText, setBulkImportText] = useState("");

  const totalSeats = 50;
  const usedSeats = rosterStudents.filter(s => s.status === "active").length;
  const avgProgress = Math.round(rosterStudents.reduce((sum, s) => sum + s.progress, 0) / Math.max(rosterStudents.length, 1));

  const isInstitution = landingAuthRole === "institution";

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Header */}
      <div className="blue-gradient-bg rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-blue-400/20">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-blue-300/30 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-3">
          <span className="px-3 py-1 bg-blue-900/60 text-[9px] font-extrabold uppercase tracking-widest border border-blue-300/30 rounded-full">
            🏛️ {isInstitution ? "Institution" : "School"} Admin Panel
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase">
            {studentName || "School Dashboard"}
          </h2>
          <p className="text-sm text-blue-100 font-light max-w-xl">
            Manage your roster, track student progress, and configure your institution's Water Classroom deployment.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <span className="bg-blue-900/50 border border-blue-400/30 px-3 py-1 rounded-full text-[10px] font-mono">
              📧 {loginEmail}
            </span>
            <span className="bg-emerald-900/50 border border-emerald-400/30 px-3 py-1 rounded-full text-[10px] font-mono">
              📚 {onboardingCurriculum}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 flex-wrap">
        {[
          { key: "overview" as const, label: "Overview", icon: BarChart3 },
          { key: "roster" as const, label: "Student Roster", icon: Users },
          { key: "analytics" as const, label: "Analytics", icon: TrendingUp },
          { key: "settings" as const, label: "Settings", icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition ${
                activeSection === tab.key
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── OVERVIEW ─── */}
      {activeSection === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="frosted-glass rounded-2xl p-5 border border-blue-900/30 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400">
                <Users className="w-4 h-4" />
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Active Students</span>
              </div>
              <strong className="text-3xl font-extrabold text-white">{usedSeats}</strong>
              <span className="text-[10px] text-slate-500 block">/ {totalSeats} licensed seats</span>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(usedSeats / totalSeats) * 100}%` }} />
              </div>
            </div>
            <div className="frosted-glass rounded-2xl p-5 border border-blue-900/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <GraduationCap className="w-4 h-4" />
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Avg Progress</span>
              </div>
              <strong className="text-3xl font-extrabold text-white">{avgProgress}%</strong>
              <span className="text-[10px] text-slate-500 block">Across all students</span>
            </div>
            <div className="frosted-glass rounded-2xl p-5 border border-blue-900/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400">
                <ClipboardList className="w-4 h-4" />
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Curriculums</span>
              </div>
              <strong className="text-3xl font-extrabold text-white">
                {new Set(rosterStudents.map(s => s.curriculum)).size}
              </strong>
              <span className="text-[10px] text-slate-500 block">Active tracks</span>
            </div>
            <div className="frosted-glass rounded-2xl p-5 border border-blue-900/30 space-y-2">
              <div className="flex items-center gap-2 text-blue-400">
                <CreditCard className="w-4 h-4" />
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Monthly Cost</span>
              </div>
              <strong className="text-3xl font-extrabold text-white">${usedSeats * 12}</strong>
              <span className="text-[10px] text-slate-500 block">/ month @ $12/student</span>
            </div>
          </div>

          <div className="frosted-glass rounded-2xl p-6 border border-blue-900/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" /> Quick Actions
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button onClick={() => setActiveSection("roster")}
                className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-indigo-500/50 transition text-left space-y-1">
                <Users className="w-5 h-5 text-indigo-400" />
                <span className="text-xs font-bold block">Manage Roster</span>
                <span className="text-[9px] text-slate-500">Add or invite students</span>
              </button>
              <button onClick={() => setActiveSection("analytics")}
                className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-emerald-500/50 transition text-left space-y-1">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="text-xs font-bold block">View Analytics</span>
                <span className="text-[9px] text-slate-500">Progress & engagement</span>
              </button>
              <button
                className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-blue-500/50 transition text-left space-y-1">
                <Download className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-bold block">Export Reports</span>
                <span className="text-[9px] text-slate-500">CSV / PDF summaries</span>
              </button>
              <button
                className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl hover:border-amber-500/50 transition text-left space-y-1">
                <Settings className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold block">Configuration</span>
                <span className="text-[9px] text-slate-500">Curriculum & settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── STUDENT ROSTER ─── */}
      {activeSection === "roster" && (
        <div className="space-y-6">
          <div className="frosted-glass rounded-2xl p-6 border border-blue-900/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" /> Student Roster
                </h3>
                <p className="text-[10px] text-slate-400">{rosterStudents.length} students ({usedSeats} active)</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowAddStudent(!showAddStudent)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Student
                </button>
                <button onClick={() => setBulkImportText(bulkImportText ? "" : "Add emails, one per line...")}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded-lg uppercase tracking-wider transition"
                >
                  Bulk Import
                </button>
              </div>
            </div>

            {/* Add single student form */}
            {showAddStudent && (
              <div className="bg-slate-950/60 border border-indigo-900/30 rounded-xl p-4 space-y-3 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input type="text" placeholder="Full Name" value={newStudentName} onChange={e => setNewStudentName(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
                  <input type="email" placeholder="Email Address" value={newStudentEmail} onChange={e => setNewStudentEmail(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
                  <select value={newStudentGrade} onChange={e => setNewStudentGrade(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
                    <option value="">Select Grade</option>
                    <option value="Pre-K">Pre-K</option>
                    <option value="Kindergarten">Kindergarten</option>
                    <option value="1st Grade">1st Grade</option>
                    <option value="2nd Grade">2nd Grade</option>
                    <option value="3rd Grade">3rd Grade</option>
                    <option value="4th Grade">4th Grade</option>
                    <option value="5th Grade">5th Grade</option>
                    <option value="6th Grade">6th Grade</option>
                    <option value="7th Grade">7th Grade</option>
                    <option value="8th Grade">8th Grade</option>
                    <option value="9th Grade">9th Grade</option>
                    <option value="10th Grade">10th Grade</option>
                    <option value="11th Grade">11th Grade</option>
                    <option value="12th Grade">12th Grade</option>
                    <option value="Undergraduate">Undergraduate</option>
                  </select>
                </div>
                <button onClick={() => {
                  if (!newStudentName.trim() || !newStudentEmail.trim() || !newStudentGrade) return;
                  const newStudent: RosterStudent = {
                    id: `s-${Date.now()}`,
                    name: newStudentName.trim(),
                    email: newStudentEmail.trim(),
                    grade: newStudentGrade,
                    curriculum: onboardingCurriculum || "U.S. Common Core",
                    status: "invited",
                    lastActive: "-",
                    progress: 0,
                  };
                  setRosterStudents(prev => [newStudent, ...prev]);
                  setNewStudentName("");
                  setNewStudentEmail("");
                  setNewStudentGrade("");
                  setShowAddStudent(false);
                }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg uppercase transition disabled:opacity-40"
                  disabled={!newStudentName.trim() || !newStudentEmail.trim() || !newStudentGrade}
                >
                  Add to Roster
                </button>
              </div>
            )}

            {/* Bulk import */}
            {bulkImportText && (
              <div className="bg-slate-950/60 border border-amber-900/30 rounded-xl p-4 space-y-3 animate-fade-in">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Paste emails (one per line)</label>
                <textarea rows={4} value={bulkImportText} onChange={e => setBulkImportText(e.target.value)}
                  placeholder="alice@school.edu&#10;bob@school.edu&#10;carol@school.edu"
                  className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 resize-none font-mono" />
                <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold rounded-lg uppercase transition">
                  Import Students
                </button>
              </div>
            )}

            {/* Roster table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[9px] uppercase tracking-wider text-slate-500 font-mono">
                    <th className="text-left py-2.5 px-2 font-bold">Name</th>
                    <th className="text-left py-2.5 px-2 font-bold">Email</th>
                    <th className="text-left py-2.5 px-2 font-bold">Grade</th>
                    <th className="text-left py-2.5 px-2 font-bold hidden sm:table-cell">Curriculum</th>
                    <th className="text-center py-2.5 px-2 font-bold">Status</th>
                    <th className="text-center py-2.5 px-2 font-bold hidden md:table-cell">Progress</th>
                    <th className="text-right py-2.5 px-2 font-bold"></th>
                  </tr>
                </thead>
                <tbody>
                  {rosterStudents.map(s => (
                    <tr key={s.id} className="border-b border-slate-900/60 hover:bg-slate-950/40 transition">
                      <td className="py-2.5 px-2 font-bold text-white">{s.name}</td>
                      <td className="py-2.5 px-2 text-slate-400">{s.email}</td>
                      <td className="py-2.5 px-2 text-slate-300">{s.grade}</td>
                      <td className="py-2.5 px-2 text-slate-400 hidden sm:table-cell">{s.curriculum}</td>
                      <td className="py-2.5 px-2 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          s.status === "active" ? "bg-emerald-950 text-emerald-400 border border-emerald-800" :
                          s.status === "invited" ? "bg-blue-950 text-blue-400 border border-blue-800" :
                          "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center hidden md:table-cell">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${
                              s.progress >= 70 ? "bg-emerald-500" : s.progress >= 30 ? "bg-amber-500" : "bg-blue-500"
                            }`} style={{ width: `${s.progress}%` }} />
                          </div>
                          <span className="text-[9px] font-mono text-slate-400">{s.progress}%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <button className="p-1 hover:bg-rose-950/50 rounded text-slate-500 hover:text-rose-400 transition"
                          onClick={() => setRosterStudents(prev => prev.filter(x => x.id !== s.id))}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── ANALYTICS ─── */}
      {activeSection === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="frosted-glass rounded-2xl p-6 border border-blue-900/30 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" /> Engagement Overview
            </h3>
            <div className="space-y-3">
              {[
                { label: "Daily Active Users", value: `${usedSeats}`, total: `${totalSeats}`, pct: `${Math.round(usedSeats/totalSeats*100)}%`, color: "bg-emerald-500" },
                { label: "Avg Session Time", value: "47 min", total: "-", pct: "-", color: "bg-blue-500" },
                { label: "Lessons Completed (All)", value: `${rosterStudents.reduce((s, x) => s + Math.floor(x.progress / 10), 0)}`, total: "-", pct: "-", color: "bg-amber-500" },
                { label: "Certificate Readiness", value: `${rosterStudents.filter(s => s.progress >= 80).length}`, total: `${usedSeats}`, pct: usedSeats ? `${Math.round(rosterStudents.filter(s => s.progress >= 80).length / usedSeats * 100)}%` : "0%", color: "bg-indigo-500" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <strong className="text-lg font-extrabold text-white">{item.value}</strong>
                      {item.total !== "-" && <span className="text-[10px] text-slate-500">/ {item.total}</span>}
                    </div>
                  </div>
                  {item.pct !== "-" && (
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-white">{item.pct}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="frosted-glass rounded-2xl p-6 border border-blue-900/30 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" /> Curriculum Distribution
            </h3>
            {Array.from(new Set(rosterStudents.map(s => s.curriculum))).map(curriculum => {
              const count = rosterStudents.filter(s => s.curriculum === curriculum).length;
              const pct = Math.round((count / rosterStudents.length) * 100);
              return (
                <div key={curriculum} className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-300">{curriculum}</span>
                    <span className="text-slate-500 font-mono">{count} students ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── SETTINGS ─── */}
      {activeSection === "settings" && (
        <div className="frosted-glass rounded-2xl p-6 border border-blue-900/30 space-y-6 max-w-2xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-400" /> Institution Settings
          </h3>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Institution Name</label>
              <input type="text" value={studentName} readOnly
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white/60 cursor-not-allowed" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Admin Email</label>
              <input type="email" value={loginEmail} readOnly
                className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white/60 cursor-not-allowed" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Licensed Seats</label>
              <div className="flex items-center gap-2">
                <input type="number" value={totalSeats} readOnly
                  className="w-24 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white/60 cursor-not-allowed" />
                <span className="text-[10px] text-slate-500">seats at $12/student/month</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Default Curriculum</label>
              <select className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white">
                <option>U.S. Common Core</option>
                <option>UK GCSE</option>
                <option>International Baccalaureate (IB)</option>
                <option>Swiss Maturité</option>
              </select>
            </div>
            <div className="flex items-center gap-2 p-3 bg-slate-950/50 rounded-xl border border-slate-800">
              <Shield className="w-5 h-5 text-emerald-400" />
              <div className="text-[10px] text-slate-400">
                <strong className="text-emerald-300 block">Deployment Active</strong>
                Your institution is online. All active students have full access to the Water Classroom.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
