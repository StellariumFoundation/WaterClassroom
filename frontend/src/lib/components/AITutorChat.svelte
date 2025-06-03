<script lang="ts">
  import { onMount, afterUpdate, createEventDispatcher, onDestroy } from 'svelte';
  // Not importing Button.svelte for the send button to have more control over its specific compact styling.
  // However, the close button could be a Button component if we had an icon-only variant.

  export let isOpen: boolean = false;

  const dispatch = createEventDispatcher();

  interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }

  let messages: Message[] = [];
  let currentMessage: string = '';
  let messageIdCounter: number = 0;
  let chatMessagesElement: HTMLElement; // For scrolling
  let chatInputAreaElement: HTMLTextAreaElement; // For focusing

  onMount(() => {
    if (messages.length === 0) {
      messages = [
        {
          id: messageIdCounter++,
          text: "Hello! I'm your AI Tutor. How can I help you with your lessons today?",
          sender: 'ai',
          timestamp: new Date(),
        },
      ];
    }
  });

  function sendMessage() {
    if (!currentMessage.trim()) return;

    const newUserMessage: Message = {
      id: messageIdCounter++,
      text: currentMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    messages = [...messages, newUserMessage];
    const previousMessage = currentMessage; // Store for potential retry or context
    currentMessage = '';

    setTimeout(() => {
      const aiResponse: Message = {
        id: messageIdCounter++,
        text: `Thinking about "${previousMessage.substring(0,20)}..." \n(This is a placeholder AI response. Actual AI integration will follow.)`,
        sender: 'ai',
        timestamp: new Date(),
      };
      messages = [...messages, aiResponse];
    }, 1200);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  afterUpdate(() => {
    if (chatMessagesElement) {
      chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
    }
    if (isOpen && chatInputAreaElement) {
        // chatInputAreaElement.focus(); // Can be slightly aggressive UX
    }
  });

  function handleClose() {
    dispatch('close'); // Parent component will set isOpen to false
  }

  // Prevent body scroll when modal is open
  // Using $: for reactivity to isOpen prop changes
  $: {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  }
  // Ensure body scroll is restored if component is destroyed while open
  onDestroy(() => {
    if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
    }
  });

  // Simple SVG Paper Plane Icon
  const sendIconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20px" height="20px">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  `;

</script>

{#if isOpen}
  <div class="chat-overlay" on:click|self={handleClose} role="dialog" aria-modal="true" aria-labelledby="chat-header-title">
    <div class="chat-widget">
      <header class="chat-header">
        <h2 id="chat-header-title" class="chat-title">AI Tutor</h2>
        <button class="close-button" on:click={handleClose} title="Close Chat" aria-label="Close Chat">&times;</button>
      </header>

      <div class="chat-messages" bind:this={chatMessagesElement}>
        {#each messages as message (message.id)}
          <div class="message-wrapper {message.sender === 'user' ? 'user' : 'ai'}">
            <div class="message-bubble">
              <p class="message-text">{message.text}</p>
              <span class="message-timestamp">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        {/each}
      </div>

      <footer class="chat-input-area">
        <textarea
          bind:this={chatInputAreaElement}
          bind:value={currentMessage}
          on:keydown={handleKeydown}
          placeholder="Ask a question..."
          rows="1"
          class="chat-textarea"
        ></textarea>
        <button class="send-button" on:click={sendMessage} disabled={!currentMessage.trim()} aria-label="Send message">
          {@html sendIconSVG}
        </button>
      </footer>
    </div>
  </div>
{/if}

<style>
  .chat-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3); /* Subtle dark overlay */
    display: flex;
    /* Changed alignment for a more "slide-in" from bottom-right feel if desired, or keep center */
    justify-content: flex-end; /* Or center */
    align-items: flex-end;   /* Or center */
    padding: var(--spacing-lg); /* 16px padding from window edges */
    z-index: 1000; /* High z-index for overlay */
  }

  .chat-widget {
    width: 100%;
    max-width: 420px; /* Slightly wider */
    height: clamp(300px, 75vh, 650px); /* Responsive height */
    background-color: var(--neutral-bg); /* Light gray background for the widget */
    border-radius: var(--border-radius-lg); /* 8px */
    box-shadow: var(--box-shadow-lg); /* Prominent shadow */
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: var(--font-family-system);
  }

  .chat-header {
    background-color: var(--neutral-white); /* Header distinct from chat messages area */
    /* border-bottom: 1px solid var(--neutral-border); */
    padding: var(--spacing-md) var(--spacing-lg); /* 12px 16px */
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
  }

  .chat-title {
    margin: 0;
    font-size: var(--font-size-h6); /* 1rem */
    font-weight: var(--font-weight-semibold);
    color: var(--neutral-text-body);
  }

  .close-button {
    background: transparent;
    border: none;
    color: var(--neutral-text-subtle);
    font-size: var(--font-size-h3); /* Larger, more touch-friendly */
    font-weight: var(--font-weight-light); /* Thinner 'X' */
    cursor: pointer;
    padding: var(--spacing-xs); /* 4px */
    line-height: 1;
    border-radius: var(--border-radius-round); /* Make it circular on hover/focus if desired */
  }
  .close-button:hover, .close-button:focus-visible {
    color: var(--neutral-text-body);
    background-color: var(--neutral-bg); /* Subtle background for hover */
  }

  .chat-messages {
    flex-grow: 1;
    padding: var(--spacing-md); /* 12px */
    overflow-y: auto;
    background-color: var(--neutral-bg); /* Matches widget background */
    /* Webkit scrollbar styling */
    scrollbar-width: thin;
    scrollbar-color: var(--neutral-border) transparent;
  }
  .chat-messages::-webkit-scrollbar {
    width: 6px;
  }
  .chat-messages::-webkit-scrollbar-track {
    background: transparent;
  }
  .chat-messages::-webkit-scrollbar-thumb {
    background-color: var(--neutral-border);
    border-radius: var(--border-radius-round);
  }

  .message-wrapper {
    display: flex;
    margin-bottom: var(--spacing-md); /* 12px */
  }
  .message-wrapper.user {
    justify-content: flex-end;
  }
  .message-wrapper.ai {
    justify-content: flex-start;
  }

  .message-bubble {
    padding: var(--spacing-sm) var(--spacing-md); /* 8px 12px */
    border-radius: var(--border-radius-lg); /* Softer, more bubbly */
    max-width: 85%; /* Max width of message bubble */
    word-wrap: break-word;
    box-shadow: var(--box-shadow-sm);
  }
  .message-wrapper.user .message-bubble {
    background-color: var(--primary-blue);
    color: var(--neutral-white);
    border-bottom-right-radius: var(--border-radius-sm); /* "Tail" effect */
  }
  .message-wrapper.ai .message-bubble {
    background-color: var(--neutral-white); /* AI messages on light card-like bg */
    color: var(--neutral-text-body);
    border: 1px solid var(--neutral-border);
    border-bottom-left-radius: var(--border-radius-sm); /* "Tail" effect */
  }

  .message-text {
    margin: 0 0 var(--spacing-xs) 0;
    line-height: var(--line-height-base);
    white-space: pre-wrap; /* Preserve line breaks in messages */
  }

  .message-timestamp {
    font-size: var(--font-size-tiny); /* 12px */
    display: block;
    opacity: 0.8;
  }
  .message-wrapper.user .message-timestamp {
    text-align: right;
    color: var(--primary-blue-lighter);
  }
  .message-wrapper.ai .message-timestamp {
    text-align: left;
    color: var(--neutral-text-subtle);
  }

  .chat-input-area {
    display: flex;
    align-items: flex-end; /* Align items to bottom if textarea grows */
    padding: var(--spacing-md); /* 12px */
    background-color: var(--neutral-white); /* Input area distinct from messages */
    border-top: 1px solid var(--neutral-border);
    flex-shrink: 0;
  }

  .chat-textarea {
    flex-grow: 1;
    padding: var(--spacing-sm) var(--spacing-md); /* 8px 12px */
    border: 1.5px solid var(--neutral-border);
    border-radius: var(--border-radius-base); /* 6px */
    font-family: var(--font-family-system);
    font-size: var(--font-size-body);
    line-height: var(--line-height-base);
    resize: none; /* No manual resize */
    background-color: var(--neutral-white);
    color: var(--neutral-text-body);
    max-height: 100px; /* Limit growth of textarea */
    overflow-y: auto; /* Scroll within textarea if content exceeds max-height */
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .chat-textarea:focus, .chat-textarea:focus-visible {
    border-color: var(--primary-blue);
    outline: none;
    box-shadow: 0 0 0 2px var(--primary-blue-lighter);
  }
  .chat-textarea::placeholder {
    color: var(--neutral-text-subtle);
  }

  .send-button {
    background-color: var(--primary-blue);
    color: var(--neutral-white);
    border: none;
    border-radius: var(--border-radius-round); /* Circular button */
    width: 38px; /* Fixed size for icon button */
    height: 38px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-left: var(--spacing-sm); /* 8px */
    padding: 0; /* Remove padding for icon button */
    transition: background-color 0.15s ease;
  }
  .send-button:hover:not(:disabled) {
    background-color: var(--primary-blue-darker);
  }
  .send-button:disabled {
    background-color: var(--neutral-border);
    cursor: not-allowed;
    opacity: 0.7;
  }
  .send-button :global(svg) { /* Style the inline SVG */
    fill: var(--neutral-white);
  }
</style>
