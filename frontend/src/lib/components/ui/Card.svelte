<script lang="ts">
  export let title = '';
  export let subtitle = '';
  // No specific props for this basic version
</script>

<div class="card">
  {#if $$slots.header}
    <header class="card-header">
      <slot name="header"></slot>
    </header>
  {/if}

  <div class="card-content">
    {#if title}
      <h2 class="card-title">{title}</h2>
    {/if}
    {#if subtitle}
      <p class="card-subtitle">{subtitle}</p>
    {/if}
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
    background-color: var(--neutral-white); /* Card background */
    border: 1px solid var(--neutral-border);
    border-radius: var(--border-radius-lg); /* Slightly larger radius for cards: 8px */
    box-shadow: var(--box-shadow-sm);
    overflow: hidden;
    margin-bottom: var(--spacing-xl); /* Consistent spacing: 24px */
  }

  .card-header {
    padding: var(--spacing-lg) var(--spacing-xl); /* 16px 24px */
    background-color: var(--neutral-white); /* Header can be same as card or slightly different */
    border-bottom: 1px solid var(--neutral-border);
    font-size: var(--font-size-h5); /* Example: 1.25rem */
    font-weight: var(--font-weight-semibold);
  }

  .card-title {
    font-size: var(--font-size-h4); /* Adjust as needed */
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--spacing-xs); /* Example: 4px if subtitle follows */
  }

  .card-subtitle {
    font-size: var(--font-size-body); /* Adjust as needed */
    color: var(--neutral-text-subtle);
    margin-bottom: var(--spacing-md); /* Example: 12px before main content */
  }

  .card-title + .card-subtitle {
    /* Less margin if both title and subtitle are present and subtitle directly follows title */
    margin-top: var(--spacing-xs);
  }


  .card-header :global(h1),
  .card-header :global(h2),
  .card-header :global(h3),
  .card-header :global(h4),
  .card-header :global(h5),
  .card-header :global(h6) {
    margin: 0; /* Remove default margins from headings in slot */
    font-size: inherit; /* Inherit size from .card-header */
    font-weight: inherit; /* Inherit weight */
  }

  .card-content {
    padding: var(--spacing-xl); /* 24px */
    font-size: var(--font-size-body);
    line-height: var(--line-height-base);
  }
  /* Ensure paragraphs within card content have appropriate spacing */
  .card-content :global(p:last-child) {
    margin-bottom: 0;
  }

  .card-footer {
    padding: var(--spacing-lg) var(--spacing-xl); /* 16px 24px */
    background-color: var(--neutral-bg); /* Footer slightly different bg */
    border-top: 1px solid var(--neutral-border);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md); /* 12px gap */
  }
</style>
