import { ClipboardList, Plus, Check } from "lucide-react";
import { Task } from "../../types";

export interface TasksTabProps {
  activeTab: string;
  isCreatingTask: boolean;
  setIsCreatingTask: (isCreating: boolean) => void;
  handleCreateTask: (e: any) => void;
  newTaskTitle: string;
  setNewTaskTitle: (title: string) => void;
  newTaskCategory: string;
  setNewTaskCategory: (cat: string) => void;
  newTaskReward: number;
  setNewTaskReward: (reward: number) => void;
  newTaskDesc: string;
  setNewTaskDesc: (desc: string) => void;
  tasks: Task[];
  handleJoinTask: (taskId: string) => void;
}

export default function TasksTab({
  activeTab,
  isCreatingTask,
  setIsCreatingTask,
  handleCreateTask,
  newTaskTitle,
  setNewTaskTitle,
  newTaskCategory,
  setNewTaskCategory,
  newTaskReward,
  setNewTaskReward,
  newTaskDesc,
  setNewTaskDesc,
  tasks,
  handleJoinTask,
}: TasksTabProps) {
  return (
    <>
      {activeTab === "tasks" && (
        <div className="space-y-8 animate-fade-in text-white">
          
          {/* Explanatory introduction card */}
          <div className="bg-gradient-to-r from-blue-950 to-[#0b2545] p-6 sm:p-8 rounded-3xl border border-blue-500/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#a855f7]">Decentralized Microtask Terminal</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold uppercase">
                Classroom Board of Tasks
              </h3>
              <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
                Apply first-principles learning directly. Earn verified points and unlock premium credentials by claiming open policy, 
                robotic, or community building tasks designated by municipal registries and academic leaders.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingTask(!isCreatingTask)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Propose New Project
            </button>
          </div>

          {/* Task Creation Form */}
          {isCreatingTask && (
            <form onSubmit={handleCreateTask} className="frosted-glass rounded-2xl p-6 border border-blue-500/20 space-y-4 max-w-xl mx-auto animate-fade-in">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h4 className="font-extrabold text-white text-sm uppercase">Propose Ecosystem Task</h4>
                <button
                  type="button"
                  onClick={() => setIsCreatingTask(false)}
                  className="text-slate-400 hover:text-white font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hydro-electric Microgrid controller mapping"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700/60 px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Category</label>
                  <select
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Policy">Policy & Creed</option>
                    <option value="Tech">Tech & Simulation</option>
                    <option value="Philanthropy">Philanthropy Mesh</option>
                    <option value="Community">Community Admin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Reward XP Award</label>
                  <input
                    type="number"
                    value={newTaskReward}
                    onChange={(e) => setNewTaskReward(Math.max(100, parseInt(e.target.value) || 0))}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Quantifiable Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide clear mathematical criteria to determine successful project delivery."
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase transition shadow active:scale-98"
              >
                Broadcast Proposal to Registries
              </button>
            </form>
          )}

          {/* Task Stacks column views */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* STACK A: OPEN PROJECTS */}
            <div className="space-y-4">
              <span className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider font-bold text-[#60a5fa] bg-blue-950 border border-blue-900/30 rounded-full">
                🔓 Open Projects ({tasks.filter((t) => t.status === "Open").length})
              </span>

              <div className="space-y-3">
                {tasks
                  .filter((t) => t.status === "Open" || (!t.status))
                  .map((t) => (
                    <div key={t.id} className="frosted-glass-dark rounded-xl p-4 border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[9px] uppercase font-mono tracking-widest bg-blue-950/60 p-1 rounded font-bold text-blue-400">
                          {t.category}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">{t.rewardPoints} XP</span>
                      </div>
                      
                      <h4 className="font-extrabold text-white text-sm">{t.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">{t.description}</p>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-900/60">
                        <span className="text-[9px] text-slate-500">By {t.createdBy}</span>
                        <button
                          onClick={() => handleJoinTask(t.id)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white transition flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Commit Job
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* STACK B: IN PROGRESS */}
            <div className="space-y-4">
              <span className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider font-bold text-[#fbbf24] bg-amber-950/40 border border-amber-900/40 rounded-full">
                ⚙️ Active In-Progress ({tasks.filter((t) => t.status === "In Progress").length})
              </span>

              <div className="space-y-3">
                {tasks
                  .filter((t) => t.status === "In Progress")
                  .map((t) => (
                    <div key={t.id} className="frosted-glass rounded-xl p-4 border border-blue-900/10 space-y-3">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[9px] uppercase font-mono tracking-widest bg-amber-950 text-amber-400 p-1 rounded font-bold">
                          {t.category}
                        </span>
                        <span className="text-[10px] font-mono text-[#a855f7]">{t.rewardPoints} XP</span>
                      </div>
                      
                      <h4 className="font-extrabold text-white text-sm">{t.title}</h4>
                      <p className="text-slate-350 text-xs leading-relaxed">{t.description}</p>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                        <span className="text-[9px] text-slate-400">Assigned: {t.assignee}</span>
                        <button
                          onClick={() => handleJoinTask(t.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold text-white transition flex items-center gap-1"
                        >
                          <Check className="w-3 h-3 animate-pulse" /> Complete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* STACK C: COMPLETED INDEX */}
            <div className="space-y-4">
              <span className="px-3 py-1 font-mono text-[9px] uppercase tracking-wider font-bold text-[#34d399] bg-emerald-950/40 border border-emerald-900/40 rounded-full">
                ✓ Verified Completed ({tasks.filter((t) => t.status === "Completed").length})
              </span>

              <div className="space-y-3">
                {tasks
                  .filter((t) => t.status === "Completed")
                  .map((t) => (
                    <div key={t.id} className="bg-slate-900/30 rounded-xl p-4 border border-[#0d2550] space-y-3 opacity-75">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[9px] uppercase font-mono tracking-widest bg-slate-950 p-1 rounded font-bold text-slate-500">
                          {t.category}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400">Claimed</span>
                      </div>
                      
                      <h4 className="font-bold text-slate-300 text-sm line-through">{t.title}</h4>
                      <p className="text-slate-500 text-xs line-through">{t.description}</p>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-900/60">
                        <span className="text-[9px] text-slate-500">Checked under Water Classroom Standard</span>
                        <span className="text-[10px] text-emerald-400 font-bold block">Archived</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </>
  );
}
