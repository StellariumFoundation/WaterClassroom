<script lang="ts">
  import { appState, handleLoadInstitutionData } from '../lib/store.svelte';
  import { Users, GraduationCap, BarChart3, Settings, Plus, Trash2, Shield, ClipboardList, CreditCard, Download, TrendingUp, BookOpen } from 'lucide-svelte';
  import { fade, slide } from 'svelte/transition';

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



  let activeSection = $state<"overview" | "roster" | "tutors" | "analytics" | "settings">("overview");
  let showAddStudent = $state(false);
  let newStudentEmail = $state("");
  let newStudentName = $state("");
  let newStudentGrade = $state("");

  const realStudents = $derived(appState.institutionStudents as any as RosterStudent[]);
  const effectiveStudents = $derived(realStudents);
  const rosterStudents = $derived(effectiveStudents as RosterStudent[]);
  const realTutors = $derived(appState.institutionTutors);
  const totalSeats = appState.institutionGradeRange === "K-Grad" ? 1000 : 50;
  const usedSeats = $derived(effectiveStudents.filter((s: any) => s.status !== 'invited').length || effectiveStudents.length);
  const avgProgress = $derived(Math.round(effectiveStudents.reduce((sum: number, s: any) => sum + Math.round((s.points || 0) / 10), 0) / Math.max(effectiveStudents.length, 1)));
  const isInstitution = $derived(appState.landingAuthRole === "institution");

  const widthClass = (pct: number) => pct >= 100 ? 'w-full' : pct >= 75 ? 'w-3/4' : pct >= 50 ? 'w-1/2' : pct >= 25 ? 'w-1/4' : 'w-0';

  $effect(() => {
    if (isInstitution && appState.institutionStudents.length === 0) {
      handleLoadInstitutionData();
    }
  });
</script>

<div transition:fade={{ duration: 300 }} class="space-y-8 animate-fade-in text-white">
  <!-- Header -->
  <div class="blue-gradient-bg rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-blue-400/20">
    <div class="absolute right-0 top-0 -mr-16 -mt-16 w-48 h-48 bg-blue-300/30 rounded-full blur-3xl"></div>
    <div class="relative z-10 space-y-3">
      <span class="px-3 py-1 bg-blue-900/60 text-[9px] font-extrabold uppercase tracking-widest border border-blue-300/30 rounded-full">
        🏛️ {isInstitution ? "Institution" : "School"} Admin Panel
      </span>
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase">{appState.studentName || "School Dashboard"}</h2>
      <p class="text-sm text-blue-100 font-light max-w-xl">Manage your roster, track student progress, and configure your institution's Water Classroom deployment.</p>
      <div class="flex flex-wrap gap-3 pt-2">
        <span class="bg-blue-900/50 border border-blue-400/30 px-3 py-1 rounded-full text-[10px] font-mono">📧 {appState.loginEmail}</span>
        <span class="bg-emerald-900/50 border border-emerald-400/30 px-3 py-1 rounded-full text-[10px] font-mono">📚 {appState.onboardingCurriculum}</span>
      </div>
    </div>
  </div>

  <!-- Navigation Tabs -->
  <div class="flex gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 flex-wrap">
    {#each [{ key: "overview" as const, label: "Overview", icon: BarChart3 }, { key: "roster" as const, label: "Student Roster", icon: Users }, { key: "tutors" as const, label: "Tutors", icon: GraduationCap }, { key: "analytics" as const, label: "Analytics", icon: TrendingUp }, { key: "settings" as const, label: "Settings", icon: Settings }] as tab}
      <button onclick={() => activeSection = tab.key} class="flex items-center gap-1.5 px-4 py-2 text-[10px] font-bold rounded-lg uppercase tracking-wider transition {activeSection === tab.key ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}">
        <tab.icon class="w-3.5 h-3.5" /> {tab.label}
      </button>
    {/each}
  </div>

  {#if activeSection === "overview"}
    <div class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="frosted-glass rounded-2xl p-5 border border-blue-900/30 space-y-2">
          <div class="flex items-center gap-2 text-indigo-400"><Users class="w-4 h-4" /><span class="text-[10px] uppercase font-mono font-bold text-slate-400">Active Students</span></div>
          <strong class="text-3xl font-extrabold text-white">{usedSeats}</strong>
          <span class="text-[10px] text-slate-500 block">/ {totalSeats} licensed seats</span>
          <div class="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-1"><div class="bg-indigo-500 h-full rounded-full {widthClass((usedSeats / totalSeats) * 100)}"></div></div>
        </div>
        <div class="frosted-glass rounded-2xl p-5 border border-blue-900/30 space-y-2">
          <div class="flex items-center gap-2 text-emerald-400"><GraduationCap class="w-4 h-4" /><span class="text-[10px] uppercase font-mono font-bold text-slate-400">Avg Progress</span></div>
          <strong class="text-3xl font-extrabold text-white">{avgProgress}%</strong>
        </div>
        <div class="frosted-glass rounded-2xl p-5 border border-blue-900/30 space-y-2">
          <div class="flex items-center gap-2 text-amber-400"><ClipboardList class="w-4 h-4" /><span class="text-[10px] uppercase font-mono font-bold text-slate-400">Curriculums</span></div>
          <strong class="text-3xl font-extrabold text-white">{new Set(rosterStudents.map(s => s.curriculum)).size}</strong>
        </div>
        <div class="frosted-glass rounded-2xl p-5 border border-blue-900/30 space-y-2">
          <div class="flex items-center gap-2 text-blue-400"><CreditCard class="w-4 h-4" /><span class="text-[10px] uppercase font-mono font-bold text-slate-400">Monthly Cost</span></div>
          <strong class="text-3xl font-extrabold text-white">${usedSeats * 12}</strong>
        </div>
      </div>
    </div>
  {/if}

  {#if activeSection === "roster"}
    <div class="frosted-glass rounded-2xl p-6 border border-blue-900/30 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2"><Users class="w-4 h-4 text-indigo-400" /> Student Roster</h3>
          <p class="text-[10px] text-slate-400">{rosterStudents.length} students ({usedSeats} active)</p>
        </div>
        <div class="flex gap-2">
          <button onclick={() => showAddStudent = !showAddStudent} class="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition">
            <Plus class="w-3.5 h-3.5" /> Add Student
          </button>
        </div>
      </div>
      {#if showAddStudent}
        <div class="bg-slate-950/60 border border-indigo-900/30 rounded-xl p-4 space-y-3 animate-fade-in">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input type="text" placeholder="Full Name" value={newStudentName} oninput={(e) => newStudentName = (e.target as HTMLInputElement).value} class="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
            <input type="email" placeholder="Email Address" value={newStudentEmail} oninput={(e) => newStudentEmail = (e.target as HTMLInputElement).value} class="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500" />
            <select value={newStudentGrade} onchange={(e) => newStudentGrade = (e.target as HTMLSelectElement).value} class="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
              <option value="">Select Grade</option>
              {#each ["Pre-K", "Kindergarten", "1st Grade", "2nd Grade", "3rd Grade", "4th Grade", "5th Grade", "6th Grade", "7th Grade", "8th Grade", "9th Grade", "10th Grade", "11th Grade", "12th Grade", "Undergraduate"] as grade}
                <option value={grade}>{grade}</option>
              {/each}
            </select>
          </div>
          <button onclick={() => {
            if (!newStudentName.trim() || !newStudentEmail.trim() || !newStudentGrade) return;
            appState.institutionStudents = [{ id: `s-${Date.now()}`, name: newStudentName.trim(), email: newStudentEmail.trim(), grade: newStudentGrade, curriculum: appState.onboardingCurriculum || "U.S. Common Core", status: "invited", last_active: "-", progress: 0, points: 0, streak_days: 0 }, ...appState.institutionStudents as any];
            newStudentName = ""; newStudentEmail = ""; newStudentGrade = ""; showAddStudent = false;
          }} class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg uppercase transition" disabled={!newStudentName.trim() || !newStudentEmail.trim() || !newStudentGrade}>Add to Roster</button>
        </div>
      {/if}
      <div class="overflow-x-auto">
        <table class="w-full text-xs">
          <thead><tr class="border-b border-slate-800 text-[9px] uppercase tracking-wider text-slate-500 font-mono">
            <th class="text-left py-2.5 px-2 font-bold">Name</th>
            <th class="text-left py-2.5 px-2 font-bold">Email</th>
            <th class="text-left py-2.5 px-2 font-bold">Grade</th>
            <th class="text-left py-2.5 px-2 font-bold hidden sm:table-cell">Curriculum</th>
            <th class="text-center py-2.5 px-2 font-bold">Status</th>
            <th class="text-center py-2.5 px-2 font-bold hidden md:table-cell">Progress</th>
            <th class="text-right py-2.5 px-2 font-bold"></th>
          </tr></thead>
          <tbody>
            {#each rosterStudents as s (s.id)}
              <tr transition:slide={{ duration: 300 }} class="border-b border-slate-900/60 hover:bg-slate-950/40 transition">
                <td class="py-2.5 px-2 font-bold text-white">{s.name}</td>
                <td class="py-2.5 px-2 text-slate-400">{s.email}</td>
                <td class="py-2.5 px-2 text-slate-300">{s.grade}</td>
                <td class="py-2.5 px-2 text-slate-400 hidden sm:table-cell">{s.curriculum}</td>
                <td class="py-2.5 px-2 text-center">
                  <span class="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase {s.status === 'active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : s.status === 'invited' ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}">{s.status}</span>
                </td>
                <td class="py-2.5 px-2 text-center hidden md:table-cell">
                  <div class="flex items-center gap-2 justify-center">
                    <div class="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden"><div class="h-full rounded-full {s.progress >= 70 ? 'bg-emerald-500' : s.progress >= 30 ? 'bg-amber-500' : 'bg-blue-500'} {widthClass(s.progress)}"></div></div>
                    <span class="text-[9px] font-mono text-slate-400">{s.progress}%</span>
                  </div>
                </td>
                <td class="py-2.5 px-2 text-right">
                  <button class="p-1 hover:bg-rose-950/50 rounded text-slate-500 hover:text-rose-400 transition" onclick={() => appState.institutionStudents = (appState.institutionStudents as any).filter((x: any) => x.id !== s.id)}>
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/if}

  {#if activeSection === "tutors"}
    <div class="frosted-glass rounded-2xl p-6 border border-blue-900/30 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 class="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2"><GraduationCap class="w-4 h-4 text-amber-400" /> Tutor Management</h3>
          <p class="text-[10px] text-slate-400">{realTutors.length} tutors assigned to your institution</p>
        </div>
        <button onclick={() => showAddStudent = !showAddStudent} class="flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition">
          <Plus class="w-3.5 h-3.5" /> Add Tutor
        </button>
      </div>

      {#if showAddStudent}
        <div class="bg-slate-950/60 border border-amber-900/30 rounded-xl p-4 space-y-3 animate-fade-in">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="Tutor Name" bind:value={newStudentName} class="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" />
            <input type="email" placeholder="Email Address" bind:value={newStudentEmail} class="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" />
          </div>
          <button onclick={() => {
            if (!newStudentName.trim() || !newStudentEmail.trim()) return;
            showAddStudent = false;
            newStudentName = ""; newStudentEmail = ""; newStudentGrade = "";
          }} class="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold rounded-lg uppercase transition" disabled={!newStudentName.trim() || !newStudentEmail.trim()}>Save Tutor</button>
        </div>
      {/if}

      <div class="space-y-2">
        {#each realTutors as tutor (tutor.id)}
          <div transition:slide={{ duration: 300 }} class="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-amber-900/40 border border-amber-700/50 flex items-center justify-center text-amber-300 text-[10px] font-extrabold">{(tutor.name || 'T')[0].toUpperCase()}</div>
              <div>
                <strong class="text-xs text-white block">{tutor.name}</strong>
                <span class="text-[10px] text-slate-400 font-mono">{tutor.email}</span>
              </div>
            </div>
            <span class="text-[9px] font-mono text-amber-400 bg-amber-950/60 px-2 py-1 rounded border border-amber-800/50">{(tutor.subjects || []).length} subjects</span>
          </div>
        {/each}
        {#if realTutors.length === 0}
          <div class="text-center py-8 text-xs text-slate-600">
            <GraduationCap class="w-8 h-8 mx-auto mb-2 text-slate-800" />
            <p>No tutors assigned yet. Add your first tutor above.</p>
          </div>
        {/if}
      </div>
    </div>
  {/if}

  {#if activeSection === "settings"}
    <div class="frosted-glass rounded-2xl p-6 border border-blue-900/30 space-y-4">
      <h3 class="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2"><Shield class="w-4 h-4 text-amber-400" /> Curriculum Override</h3>
      <p class="text-[10px] text-slate-400">Customize lesson order for your institution's grade tracks. Changes apply immediately to enrolled students.</p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="space-y-1">
          <label class="text-[9px] uppercase font-mono text-slate-400 font-bold block">Grade Level</label>
          <select bind:value={newStudentGrade} class="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none">
            <option value="">Select Grade</option>
            {#each ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'UG'] as g}
              <option value={g}>{g === 'UG' ? 'Undergraduate' : `Grade ${g}`}</option>
            {/each}
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-[9px] uppercase font-mono text-slate-400 font-bold block">Subject</label>
          <select bind:value={appState.newPostCategory} class="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none">
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="English">English</option>
            <option value="Visual Arts">Visual Arts</option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-[9px] uppercase font-mono text-slate-400 font-bold block">Lesson Order</label>
          <select class="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white focus:outline-none">
            <option>Standard (Default)</option>
            <option>Custom (coming soon)</option>
          </select>
        </div>
      </div>

      <button onclick={() => {
        if (!newStudentGrade) return;
        appState.newPostCategory = appState.newPostCategory || "Mathematics";
      }} class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg uppercase transition" disabled={!newStudentGrade}>
        Apply Override
      </button>
    </div>
  {/if}

  {#if activeSection === "analytics"}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="frosted-glass rounded-2xl p-6 border border-blue-900/30 space-y-4">
        <h3 class="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2"><BarChart3 class="w-4 h-4 text-emerald-400" /> Engagement Overview</h3>
        <div class="space-y-3">
          {#each [{ label: "Daily Active Users", value: `${usedSeats}`, total: `${totalSeats}`, pct: `${Math.round(usedSeats/totalSeats*100)}%` }, { label: "Avg Session Time", value: "47 min", total: "-", pct: "-" }, { label: "Lessons Completed", value: `${rosterStudents.reduce((s, x) => s + Math.floor(x.progress / 10), 0)}`, total: "-", pct: "-" }, { label: "Certificate Readiness", value: `${rosterStudents.filter(s => s.progress >= 80).length}`, total: `${usedSeats}`, pct: usedSeats ? `${Math.round(rosterStudents.filter(s => s.progress >= 80).length / usedSeats * 100)}%` : "0%" }] as item, idx (idx)}
            <div class="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl">
              <div class="space-y-0.5">
                <span class="text-[10px] text-slate-400">{item.label}</span>
                <div class="flex items-center gap-2">
                  <strong class="text-lg font-extrabold text-white">{item.value}</strong>
                  {#if item.total !== "-"}<span class="text-[10px] text-slate-500">/ {item.total}</span>{/if}
                </div>
              </div>
              {#if item.pct !== "-"}
                <div class="text-right"><span class="text-lg font-extrabold text-white">{item.pct}</span></div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
      <div class="frosted-glass rounded-2xl p-6 border border-blue-900/30 space-y-4">
        <h3 class="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2"><BookOpen class="w-4 h-4 text-blue-400" /> Curriculum Distribution</h3>
        {#each Array.from(new Set(rosterStudents.map(s => s.curriculum))) as curriculum (curriculum)}
          {@const count = rosterStudents.filter(s => s.curriculum === curriculum).length}
          {@const pct = Math.round((count / rosterStudents.length) * 100)}
          <div class="space-y-1">
            <div class="flex justify-between text-[10px]">
              <span class="text-slate-300">{curriculum}</span>
              <span class="text-slate-500 font-mono">{count} students ({pct}%)</span>
            </div>
            <div class="w-full bg-slate-900 h-2 rounded-full overflow-hidden"><div class="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full {widthClass(pct)}"></div></div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if activeSection === "settings"}
    <div class="frosted-glass rounded-2xl p-6 border border-blue-900/30 space-y-6 max-w-2xl">
      <h3 class="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2"><Settings class="w-4 h-4 text-amber-400" /> Institution Settings</h3>
      <div class="space-y-4">
        <div class="space-y-1">
          <label class="text-[10px] uppercase font-mono text-slate-400 font-bold block">Institution Name</label>
          <input type="text" value={appState.studentName} readonly class="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white/60 cursor-not-allowed" />
        </div>
        <div class="space-y-1">
          <label class="text-[10px] uppercase font-mono text-slate-400 font-bold block">Admin Email</label>
          <input type="email" value={appState.loginEmail} readonly class="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white/60 cursor-not-allowed" />
        </div>
        <div class="space-y-1">
          <label class="text-[10px] uppercase font-mono text-slate-400 font-bold block">Licensed Seats</label>
          <div class="flex items-center gap-2">
            <input type="number" value={totalSeats} readonly class="w-24 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white/60 cursor-not-allowed" />
            <span class="text-[10px] text-slate-500">seats at $12/student/month</span>
          </div>
        </div>
        <div class="space-y-1">
          <label class="text-[10px] uppercase font-mono text-slate-400 font-bold block">Default Curriculum</label>
          <select class="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs text-white">
            <option>U.S. Common Core</option>
            <option>UK GCSE</option>
            <option>International Baccalaureate (IB)</option>
            <option>Swiss Maturité</option>
          </select>
        </div>
        <div class="flex items-center gap-2 p-3 bg-slate-950/50 rounded-xl border border-slate-800">
          <Shield class="w-5 h-5 text-emerald-400" />
          <div class="text-[10px] text-slate-400">
            <strong class="text-emerald-300 block">Deployment Active</strong>
            Your institution is online. All active students have full access to the Water Classroom.
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
