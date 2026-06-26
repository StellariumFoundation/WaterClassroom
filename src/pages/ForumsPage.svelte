<script lang="ts">
  import { appState, setNewPostTitle, setNewPostContent, handleLoadCommunityPosts, handleCreateCommunityPost, handleLikeCommunityPost } from '../lib/store.svelte';
  import { Users, ThumbsUp, MessageSquare } from 'lucide-svelte';
  import { fly, fade } from 'svelte/transition';

  const gradeTopics = [
    { id: "grade-K", label: "Kindergarten", subjects: ["All", "Mathematics", "English", "Visual Arts"] },
    { id: "grade-1", label: "Grade 1", subjects: ["All", "Mathematics", "English", "Science"] },
    { id: "grade-5", label: "Grade 5", subjects: ["All", "Mathematics", "Science", "English", "Visual Arts"] },
  ];

  let selectedGrade = $state("grade-5");
  let selectedSubject = $state("All");

  $effect(() => {
    if (appState.isLoggedIn) {
      handleLoadCommunityPosts(selectedGrade, selectedSubject);
    }
  });
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in text-white">
  <!-- Create Thread -->
  <div class="lg:col-span-1 space-y-6">
    <div class="frosted-glass rounded-2xl p-5 border border-blue-950 space-y-4">
      <div class="space-y-1">
        <h4 class="font-extrabold text-white text-sm uppercase tracking-wide flex items-center gap-1"><Users class="w-4 h-4 text-blue-400 animate-pulse" /> Community Space</h4>
        <p class="text-[11px] text-slate-400">Ask questions, share projects, and learn with peers.</p>
      </div>
      <form onsubmit={(e) => { e.preventDefault(); if (appState.newPostTitle.trim() && appState.newPostContent.trim()) handleCreateCommunityPost(appState.newPostTitle, appState.newPostContent, selectedSubject, selectedGrade.replace('grade-', '')); }} class="space-y-3">
        <div class="space-y-0.5">
          <label class="text-[9px] uppercase font-mono text-slate-400 block font-bold">Thread Title</label>
          <input type="text" required placeholder="Ask the community..." bind:value={appState.newPostTitle}
            class="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-2 text-xs text-white focus:outline-none" />
        </div>
        <div class="space-y-0.5">
          <label class="text-[9px] uppercase font-mono text-slate-400 block font-bold">Body</label>
          <textarea required rows={4} placeholder="Share your question or project..." bind:value={appState.newPostContent}
            class="w-full rounded-xl bg-slate-900 border border-slate-700/60 p-2 text-xs text-white focus:outline-none"></textarea>
        </div>
        {#if appState.postSubmitError}
          <p class="text-[10px] text-red-400">{appState.postSubmitError}</p>
        {/if}
        <button type="submit" disabled={appState.isSubmittingPost} class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs uppercase tracking-wide transition text-white disabled:opacity-40">Post Question (+100 XP)</button>
      </form>
    </div>

  </div>

  <!-- Threads -->
  <div class="lg:col-span-2 space-y-4">
    <div class="flex justify-between items-center flex-wrap gap-2">
      <h3 class="font-extrabold text-white uppercase tracking-wider text-base">Community Discussions</h3>
      <span class="text-xs text-slate-400">Grade {selectedGrade.replace('grade-', '')} — {selectedSubject}</span>
    </div>

    <div class="flex flex-wrap gap-2">
      {#each gradeTopics as topic}
        <button onclick={() => { selectedGrade = topic.id; selectedSubject = "All"; handleLoadCommunityPosts(topic.id, "All"); }}
          class="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition border {selectedGrade === topic.id ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}">
          {topic.label}
        </button>
      {/each}
    </div>

    {#if appState.isSubmittingPost}
      <div class="text-center py-6 text-xs text-blue-400 animate-pulse">Publishing your post...</div>
    {/if}

    <div class="space-y-3">
      {#each appState.communityPosts as post (post.id)}
        <div transition:fly={{ y: 15, duration: 300 }} class="frosted-glass-dark rounded-2xl p-5 border border-slate-800 space-y-3 relative overflow-hidden transition-all duration-300 hover:border-blue-500/20">
          <span class="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900 border border-blue-900/35 text-[9px] font-mono font-bold text-blue-400 uppercase">{post.category}</span>
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full bg-slate-900 border border-blue-500/30 flex items-center justify-center text-[10px] font-mono font-extrabold text-blue-400">{(post.author_name || 'S')[0]}</div>
            <div>
              <strong class="text-xs text-slate-200 block">{post.author_name || 'Student'}</strong>
              <span class="text-[9.5px] text-slate-500 font-light block">Level {post.author_level} student</span>
            </div>
          </div>
          <h4 class="font-extrabold text-white text-sm sm:text-base tracking-tight leading-snug pt-1">{post.title}</h4>
          <p class="text-slate-300 text-xs leading-relaxed font-light">{post.content}</p>
          <div class="flex gap-4 pt-2 border-t border-slate-900/60 text-[11px] text-slate-400">
            <button onclick={() => handleLikeCommunityPost(post.id)} class="flex items-center gap-1 hover:text-blue-400 transition"><ThumbsUp class="w-3.5 h-3.5" /> Useful ({post.likes})</button>
            <button onclick={() => alert("Replies coming soon!")} class="flex items-center gap-1 hover:text-blue-400 transition"><MessageSquare class="w-3.5 h-3.5" /> Reply ({post.replies})</button>
          </div>
        </div>
      {/each}
      {#if appState.communityPosts.length === 0 && !appState.isSubmittingPost}
        <div class="text-center py-12 text-xs text-slate-600">
          <Users class="w-8 h-8 mx-auto mb-2 text-slate-800" />
          <p>No posts yet. Be the first to ask a question!</p>
        </div>
      {/if}
    </div>
  </div>
</div>
