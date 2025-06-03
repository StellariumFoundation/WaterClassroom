<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'tertiary' | 'danger' = 'primary';
  export let onClick: (() => void) | undefined = undefined;
  export let disabled: boolean = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let href: string | undefined = undefined; // Added href prop

  // Base classes + variant specific classes
  $: buttonClass = `btn btn-${variant} ${$$props.class || ''}`; // Include additional classes

  const handleClick = (event: MouseEvent) => {
    if (onClick && !disabled) {
      onClick();
    }
    // If it's a link, default browser navigation will handle it.
    // If it's a button of type submit, default form submission will occur
    // unless event.preventDefault() was called in onClick.
  };
</script>

{#if href && !disabled}
  <a {href} class={buttonClass} role="button" aria-disabled={disabled ? 'true' : undefined} on:click={handleClick}>
    <slot />
  </a>
{:else if href && disabled}
  <a {href} class={buttonClass} role="button" aria-disabled="true">
    <slot />
  </a>
{:else}
  <button {type} class={buttonClass} on:click={handleClick} {disabled}>
    <slot />
  </button>
{/if}

<style>
  .btn {
    padding: var(--spacing-sm) var(--spacing-lg); /* 8px 16px */
    border-radius: var(--border-radius-base); /* 6px */
    text-decoration: none; /* Ensure links don't have underlines by default */
    border: 1px solid transparent;
    cursor: pointer;
    font-family: var(--font-family-system);
    font-size: var(--font-size-body); /* 1rem */
    font-weight: var(--font-weight-medium); /* 500 */
    line-height: var(--line-height-base); /* 1.6 */
    transition: background-color 0.15s ease-in-out,
                border-color 0.15s ease-in-out,
                color 0.15s ease-in-out,
                box-shadow 0.15s ease-in-out;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    user-select: none; /* Prevent text selection */
  }

  .btn:focus-visible { /* Using :focus-visible for better accessibility */
    outline: 2px solid var(--primary-blue-lighter);
    outline-offset: 2px;
    box-shadow: 0 0 0 3px var(--primary-blue-lighter);
  }

  .btn:disabled, a.btn[aria-disabled="true"] { /* Style for disabled button and link */
    opacity: 0.65;
    cursor: not-allowed;
  }

  /* Primary Button */
  .btn-primary {
    background-color: var(--primary-blue);
    color: var(--neutral-white);
    border-color: var(--primary-blue);
  }
  .btn-primary:not(:disabled):hover {
    background-color: var(--primary-blue-darker);
    border-color: var(--primary-blue-darker);
  }
  .btn-primary:not(:disabled):active {
    background-color: var(--primary-blue-darker); /* Can be even darker if defined */
  }


  /* Secondary Button - e.g., outline style */
  .btn-secondary {
    background-color: var(--neutral-white);
    color: var(--primary-blue);
    border-color: var(--primary-blue);
  }
  .btn-secondary:not(:disabled):hover {
    background-color: var(--primary-blue-lighter);
    border-color: var(--primary-blue-darker);
    color: var(--primary-blue-darker);
  }
  .btn-secondary:not(:disabled):active {
    background-color: var(--primary-blue-lighter); /* Adjust if needed */
  }


  /* Tertiary Button - e.g., subtle, less prominent, text-like */
  .btn-tertiary {
    background-color: transparent;
    color: var(--neutral-text-body);
    border-color: transparent; /* Or var(--neutral-border) for a very subtle border */
  }
  .btn-tertiary:not(:disabled):hover {
    background-color: var(--neutral-bg); /* Very light hover */
    color: var(--primary-blue-darker);
  }
  .btn-tertiary:not(:disabled):active {
    background-color: var(--neutral-border);
  }

  /* Danger Button */
  .btn-danger {
    background-color: var(--status-error);
    color: var(--neutral-white);
    border-color: var(--status-error);
  }
  .btn-danger:not(:disabled):hover {
    background-color: #c82333; /* Darker shade of --status-error */
    border-color: #c82333;
  }
  .btn-danger:not(:disabled):active {
    background-color: #c82333; /* Darker shade of --status-error */
  }
</style>
