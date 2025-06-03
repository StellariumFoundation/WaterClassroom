<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  export let checked: boolean = false;
  export let label: string | undefined = undefined;
  export let disabled: boolean = false;
  export let name: string | undefined = undefined; // Useful for forms
  export let id: string | undefined = undefined; // Allow passing ID

  const dispatch = createEventDispatcher();

  onMount(() => {
    if (!id && label) {
      id = `checkbox-${Math.random().toString(36).substring(2, 9)}`;
    }
  });

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    checked = target.checked;
    dispatch('change', event);
  }
</script>

<div class="checkbox-control {$$props.class || ''}">
  <input
    {id}
    {name}
    type="checkbox"
    bind:checked={checked}
    {disabled}
    class="styled-checkbox"
    on:change={handleChange}
  />
  {#if label}
    <label for={id} class="checkbox-label {disabled ? 'disabled' : ''}">{label}</label>
  {/if}
</div>

<style>
  .checkbox-control {
    display: flex;
    align-items: center;
    margin-bottom: var(--spacing-md); /* 12px */
    cursor: pointer; /* Make the whole control area clickable if desired, though label handles this */
  }

  .styled-checkbox {
    /* Using appearance: none to attempt more custom styling if browser support is good,
       but will rely on accent-color as primary method for modern browsers. */
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    width: 1.25em; /* Slightly larger for better touch target / visibility */
    height: 1.25em;
    margin-right: var(--spacing-sm); /* 8px */

    border: 1.5px solid var(--neutral-border);
    border-radius: var(--border-radius-sm); /* 4px */
    background-color: var(--neutral-white);

    position: relative; /* For custom checkmark */
    cursor: pointer;
    outline: none; /* Remove default outline, will add focus state below */
    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
  }

  /* Custom checkmark using a pseudo-element */
  .styled-checkbox::before {
    content: "";
    position: absolute;
    display: block;
    left: 50%;
    top: 40%; /* Adjust for visual centering of checkmark */
    width: 0.3em;
    height: 0.6em;
    border: solid var(--neutral-white); /* Checkmark color */
    border-width: 0 0.15em 0.15em 0;
    transform: translate(-50%, -50%) rotate(45deg);
    opacity: 0; /* Hidden by default */
    transition: opacity 0.1s ease-in-out;
  }

  .styled-checkbox:checked {
    background-color: var(--primary-blue);
    border-color: var(--primary-blue);
  }
  .styled-checkbox:checked::before {
    opacity: 1; /* Show checkmark */
  }

  .styled-checkbox:focus-visible {
    border-color: var(--primary-blue-darker);
    box-shadow: 0 0 0 2px var(--primary-blue-lighter);
  }

  .styled-checkbox:disabled {
    background-color: var(--neutral-bg);
    border-color: var(--neutral-border);
    opacity: 0.7;
    cursor: not-allowed;
  }
  .styled-checkbox:disabled::before { /* Ensure checkmark is also styled for disabled state if needed */
    border-color: var(--neutral-text-subtle);
  }

  .checkbox-label {
    font-family: var(--font-family-system);
    font-size: var(--font-size-body); /* 16px */
    color: var(--neutral-text-body);
    user-select: none;
    cursor: pointer;
  }

  .checkbox-label.disabled {
    color: var(--neutral-text-subtle);
    cursor: not-allowed;
  }
</style>
