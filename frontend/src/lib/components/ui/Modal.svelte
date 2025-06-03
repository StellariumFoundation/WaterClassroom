<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let isOpen: boolean = false;
  export let onClose: (() => void) | undefined = undefined; // Can also be dispatched

  const dispatch = createEventDispatcher();

  function handleClose() {
    if (onClose) {
      onClose();
    } else {
      dispatch('close'); // Fallback to dispatching event if no prop
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (isOpen && event.key === 'Escape') {
      handleClose();
    }
  }

  // Handle backdrop click to close modal
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) { // ensure click is on backdrop itself
        handleClose();
    }
  }

</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div class="modal-overlay" on:click={handleBackdropClick} role="dialog" aria-modal="true">
    <div class="modal-content">
      {#if $$slots.header}
        <header class="modal-header">
          <slot name="header"></slot>
          <button class="modal-close-btn" on:click={handleClose} aria-label="Close modal">&times;</button>
        </header>
      {:else}
        <!-- Still provide a close button if no header slot is used, but place it absolutely -->
        <button class="modal-close-btn modal-close-btn-absolute" on:click={handleClose} aria-label="Close modal">&times;</button>
      {/if}
      
      <div class="modal-body">
        <slot></slot>
      </div>

      {#if $$slots.footer}
        <footer class="modal-footer">
          <slot name="footer"></slot>
        </footer>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent backdrop */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Ensure it's on top */
  }

  .modal-content {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 500px; /* Default max width */
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    position: relative; /* For absolute positioning of close button if no header */
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .modal-header :global(h1),
  .modal-header :global(h2),
  .modal-header :global(h3) {
    margin: 0;
    font-size: 1.25rem;
  }

  .modal-close-btn {
    background: none;
    border: none;
    font-size: 1.8rem;
    line-height: 1;
    color: #888;
    cursor: pointer;
    padding: 0.25rem;
  }
  .modal-close-btn:hover {
    color: #333;
  }
  .modal-close-btn-absolute {
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    z-index: 10; /* Ensure it's above body content if header isn't present */
  }


  .modal-body {
    padding: 1.5rem;
    overflow-y: auto; /* Scrollable body if content is too long */
    flex-grow: 1;
  }

  .modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e0e0e0;
    display: flex;
    justify-content: flex-end; /* Align buttons to the right */
    gap: 0.75rem; /* Space between footer buttons */
    background-color: #f9f9f9;
  }
</style>
