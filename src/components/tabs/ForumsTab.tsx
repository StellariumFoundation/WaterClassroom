import { Users, ThumbsUp, MessageSquare } from "lucide-react";
import { ForumPost } from "../../types";

export interface ForumsTabProps {
  activeTab: string;
  handleAddForumPost: (e: any) => void;
  newPostCategory: string;
  setNewPostCategory: (cat: string) => void;
  newPostTitle: string;
  setNewPostTitle: (title: string) => void;
  newPostContent: string;
  setNewPostContent: (content: string) => void;
  forumPosts: ForumPost[];
}

export default function ForumsTab({
  activeTab,
  handleAddForumPost,
  newPostCategory,
  setNewPostCategory,
  newPostTitle,
  setNewPostTitle,
  newPostContent,
  setNewPostContent,
  forumPosts,
}: ForumsTabProps) {
  return (
    <>
      {activeTab === "collaborate" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-white">
          
          {/* Left side: create threads form */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="frosted-glass rounded-2xl p-5 border border-blue-950 space-y-4">
              <div className="space-y-1">
                <h4 className="font-extrabold text-white text-sm uppercase tracking-wide flex items-center gap-1">
                  <Users className="w-4 h-4 text-blue-400 animate-pulse" /> Community Discussion
                </h4>
                <p className="text-[11px] text-slate-400">Post educational inquiries or debate first-principles calculations.</p>
              </div>

              <form onSubmit={handleAddForumPost} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-mono text-slate-400 block font-bold">Topic Theme / Category</label>
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-2 text-xs text-white focus:outline-none"
                  >
                    <option value="General">General Question</option>
                    <option value="Robotics">Robotics Simulation</option>
                    <option value="Creed">Philosophy & Abundance</option>
                    <option value="Incentives">Structural Incentives</option>
                    <option value="Human Dynamics">Human Covenants</option>
                  </select>
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] uppercase font-mono text-slate-400 block font-bold">Thread Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Ask the sovereign community..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] uppercase font-mono text-slate-400 block font-bold">Body Context</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Formulate your request under first-principles criteria..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs uppercase tracking-wide transition text-white"
                >
                  Broadcast Thread (+100 XP)
                </button>
              </form>
            </div>

            {/* Simulated active roster map */}
            <div className="bg-[#051025]/40 border border-blue-950 p-4 rounded-xl space-y-3.5">
              <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 font-bold block">Global Classroom Hubs Peer Activity Map</span>
              <div className="space-y-2">
                {[
                  { name: "Miami Homeschool Hub", members: 23, ping: "Online" },
                  { name: "Geneva Academic Villa", members: 14, ping: "Online" },
                  { name: "Austin Tech Guild", members: 31, ping: "Maintenance" }
                ].map((h, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <strong className="text-slate-200">{h.name}</strong>
                    <span className="text-[10px] font-mono text-blue-400">{h.members} active</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right side: threads lists */}
          <div className="lg:col-span-2 space-y-4">
            
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-white uppercase tracking-wider text-base">Active peer threads</h3>
              <span className="text-xs text-slate-400">Sorted by dynamic community votes</span>
            </div>

            <div className="space-y-3">
              {forumPosts.map((post) => (
                <div key={post.id} className="frosted-glass-dark rounded-2xl p-5 border border-slate-800 space-y-3 relative overflow-hidden transition-all duration-300 hover:border-blue-500/20">
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900 border border-blue-900/35 text-[9px] font-mono font-bold text-blue-400 uppercase">
                    {post.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-900 border border-blue-500/30 flex items-center justify-center text-[10px] font-mono font-extrabold text-blue-400">
                      {post.author[0]}
                    </div>
                    <div>
                      <strong className="text-xs text-slate-200 block">{post.author}</strong>
                      <span className="text-[9.5px] text-slate-500 font-light block">Sovereign Level {post.userLevel} student</span>
                    </div>
                  </div>

                  <h4 className="font-extrabold text-white text-sm sm:text-base tracking-tight leading-snug pt-1">
                    {post.title}
                  </h4>

                  <p className="text-slate-300 text-xs leading-relaxed font-light">
                    {post.content}
                  </p>

                  <div className="flex gap-4 pt-2 border-t border-slate-900/60 text-[11px] text-slate-400">
                    <button
                      onClick={() => alert("Liked thread securely.")}
                      className="flex items-center gap-1 hover:text-blue-400 transition"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> Useful ({post.likes})
                    </button>
                    <button
                      onClick={() => alert("Joining peer consultation.")}
                      className="flex items-center gap-1 hover:text-blue-400 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Expand Answers ({post.replies})
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}
    </>
  );
}
