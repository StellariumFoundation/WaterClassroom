<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';

  export let isOpen: boolean = false; // Controls visibility, managed by parent

  interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }

  let messages: Message[] = [];
  let currentMessage: string = '';
  let messageIdCounter: number = 0;
  let chatContainerElement: HTMLElement; // For scrolling

  // Placeholder for initial greeting or context
  onMount(() => {
    if (messages.length === 0) {
      messages = [
        ...messages,
        {
          id: messageIdCounter++,
          text: "Hello! I'm your AI Tutor. How can I help you today?",
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
    currentMessage = '';

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messageIdCounter++,
        text: "Thanks for your question! I'm processing that and will get back to you shortly. (This is a placeholder response)",
        sender: 'ai',
        timestamp: new Date(),
      };
      messages = [...messages, aiResponse];
    }, 1000);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  // Auto-scroll to bottom
  afterUpdate(() => {
    if (chatContainerElement) {
      chatContainerElement.scrollTop = chatContainerElement.scrollHeight;
    }
  });

  // Non-functional close button for now
  function closeChat() {
    // In a real app, this would emit an event or call a prop function
    console.log("Close button clicked - parent would handle this.");
    // For demonstration, we can set isOpen to false, but parent should control this via prop binding.
    // isOpen = false; // This would work if prop was bind:isOpen
  }
</script>

{#if isOpen}
  <div class="chat-widget-overlay">
    <div class="chat-widget">
      <header class="chat-header">
        <h2>AI Tutor</h2>
        <button class="close-btn" on:click={closeChat} title="Close Chat">&times;</button>
      </header>

      <div class="chat-messages" bind:this={chatContainerElement}>
        {#each messages as message (message.id)}
          <div class="message {message.sender === 'user' ? 'user-message' : 'ai-message'}">
            <p>{message.text}</p>
            <span class="timestamp">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        {/each}
      </div>

      <footer class="chat-input-area">
        <textarea
          bind:value={currentMessage}
          on:keydown={handleKeydown}
          placeholder="Type your message..."
          rows="2"
        ></textarea>
        <button on:click={sendMessage} disabled={!currentMessage.trim()}>Send</button>
      </footer>
    </div>
  </div>
{/if}

<style>
  .chat-widget-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.1); /* Slight dimming of background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .chat-widget {
    width: 100%;
    max-width: 400px;
    height: 70vh;
    max-height: 600px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: sans-serif;
  }

  .chat-header {
    background-color: #007bff; /* Theme color */
    color: white;
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chat-header h2 {
    margin: 0;
    font-size: 1.2rem;
  }

  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    line-height: 1;
  }
  .close-btn:hover {
    opacity: 0.8;
  }

  .chat-messages {
    flex-grow: 1;
    padding: 1rem;
    overflow-y: auto;
    background-color: #f9f9f9;
    border-bottom: 1px solid #eee;
  }

  .message {
    margin-bottom: 0.75rem;
    padding: 0.5rem 0.75rem;
    border-radius: 12px;
    max-width: 80%;
    word-wrap: break-word;
  }

  .message p {
    margin: 0 0 0.25rem 0;
    line-height: 1.4;
  }

  .timestamp {
    font-size: 0.7rem;
    color: #777;
    display: block;
  }

  .user-message {
    background-color: #007bff;
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 4px;
  }
  .user-message .timestamp {
    color: #e0e0e0;
    text-align: right;
  }

  .ai-message {
    background-color: #e9ecef;
    color: #333;
    margin-right: auto;
    border-bottom-left-radius: 4px;
  }
   .ai-message .timestamp {
    text-align: left;
  }


  .chat-input-area {
    display: flex;
    padding: 0.75rem;
    background-color: #ffffff;
    border-top: 1px solid #ddd;
  }

  .chat-input-area textarea {
    flex-grow: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
    font-size: 0.9rem;
    line-height: 1.4;
    margin-right: 0.5rem;
  }

  .chat-input-area button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }

  .chat-input-area button:hover {
    background-color: #0056b3;
  }
  .chat-input-area button:disabled {
    background-color: #c0c0c0;
    cursor: not-allowed;
  }
</style>
