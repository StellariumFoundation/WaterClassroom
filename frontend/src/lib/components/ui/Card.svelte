<script lang="ts">
  // No specific props for this basic version
</script>

<div class="card">
  {#if $$slots.header}
    <header class="card-header">
      <slot name="header"></slot>
    </header>
  {/if}

  <div class="card-content">
    <slot></slot>
  </div>

  {#if $$slots.footer}
    <footer class="card-footer">
      <slot name="footer"></slot>
    </footer>
  {/if}
</div>

<style>
  .card {
    background-color: #ffffff;
    border: 1px solid #e0e0e0; /* Light gray border */
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05); /* Subtle shadow */
    overflow: hidden; /* Ensures rounded corners clip content */
    margin-bottom: 1rem; /* Spacing if cards are stacked */
  }

  .card-header {
    padding: 1rem 1.25rem;
    background-color: #f8f9fa; /* Very light gray */
    border-bottom: 1px solid #e0e0e0;
  }
  /* Optional: if you want header text to be bolder or larger by default */
  .card-header :global(h1), 
  .card-header :global(h2), 
  .card-header :global(h3) {
    margin: 0; 
  }


  .card-content {
    padding: 1.25rem;
  }

  .card-footer {
    padding: 1rem 1.25rem;
    background-color: #f8f9fa;
    border-top: 1px solid #e0e0e0;
    display: flex; /* Useful for aligning buttons, etc. */
    justify-content: flex-end; /* Example: align items to the right */
    gap: 0.5rem; /* Spacing between items in footer */
  }
</style>
