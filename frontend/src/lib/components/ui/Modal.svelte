<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';

  export let isOpen: boolean = false;
  export let onClose: (() => void) | undefined = undefined;

  const dispatch = createEventDispatcher();

  function handleClose() {
    if (onClose) {
      onClose();
    } else {
      dispatch('close');
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (isOpen && event.key === 'Escape') {
      handleClose();
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }

  // Prevent body scroll when modal is open
  onMount(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
  });

  onDestroy(() => {
    document.body.style.overflow = ''; // Restore scroll on component destroy
  });

  // Reactive statement to toggle body scroll based on isOpen prop
  $: {
    if (typeof document !== 'undefined') { // Ensure document exists (SSR safety)
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
  }

</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div class="modal-overlay" on:click={handleBackdropClick} role="dialog" aria-modal="true">
    <div class="modal-content" role="document">
      {#if $$slots.header}
        <header class="modal-header">
          <slot name="header"></slot>
          <button class="modal-close-btn" on:click={handleClose} aria-label="Close modal">&times;</button>
        </header>
      {:else}
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
    background-color: rgba(0, 0, 0, 0.4); /* Using a darker overlay for more focus */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: var(--neutral-white);
    border-radius: var(--border-radius-lg); /* 8px */
    box-shadow: var(--box-shadow-lg); /* More prominent shadow for modals */
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden; /* Ensures border-radius is respected by children */
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-lg) var(--spacing-xl); /* 16px 24px */
    border-bottom: 1px solid var(--neutral-border);
  }

  .modal-header :global(h1),
  .modal-header :global(h2),
  .modal-header :global(h3) {
    margin: 0;
    font-size: var(--font-size-h5); /* 1.25rem */
    font-weight: var(--font-weight-semibold);
    color: var(--neutral-text-body);
  }

  .modal-close-btn {
    background: none;
    border: none;
    font-size: var(--font-size-h3); /* Larger, more accessible close icon */
    line-height: 1;
    color: var(--neutral-text-subtle);
    cursor: pointer;
    padding: var(--spacing-xs); /* 4px */
  }
  .modal-close-btn:hover {
    color: var(--neutral-text-body);
  }
  .modal-close-btn-absolute { /* If no header, position close button carefully */
    position: absolute;
    top: var(--spacing-md); /* 12px */
    right: var(--spacing-md); /* 12px */
    z-index: 10;
  }

  .modal-body {
    padding: var(--spacing-xl); /* 24px */
    overflow-y: auto;
    flex-grow: 1;
    font-size: var(--font-size-body);
    line-height: var(--line-height-base);
    color: var(--neutral-text-body);
  }

  .modal-footer {
    padding: var(--spacing-lg) var(--spacing-xl); /* 16px 24px */
    border-top: 1px solid var(--neutral-border);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md); /* 12px */
    background-color: var(--neutral-bg); /* Light gray footer */
  }
</style>
