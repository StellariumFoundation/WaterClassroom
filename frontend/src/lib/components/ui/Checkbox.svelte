<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let checked: boolean = false;
  export let label: string | undefined = undefined;
  export let disabled: boolean = false;
  export let name: string | undefined = undefined; // Useful for forms

  const dispatch = createEventDispatcher();
  
  // Forward change events to allow for bind:checked on the parent
  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    checked = target.checked; // Keep internal state in sync
    dispatch('change', event); // Forward the native event
  }

  let id = label ? `checkbox-${Math.random().toString(36).substring(2,9)}` : undefined;
</script>

<div class="checkbox-control">
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
    <label for={id} class="checkbox-label {disabled ? 'disabled-label' : ''}">{label}</label>
  {/if}
</div>

<style>
  .checkbox-control {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem; /* Spacing between checkbox controls */
  }

  .styled-checkbox {
    width: 1.15em; /* Slightly larger than default */
    height: 1.15em;
    margin-right: 0.5rem;
    cursor: pointer;
    accent-color: #007bff; /* Use primary color for the checkmark/background */
  }

  .styled-checkbox:disabled {
    cursor: not-allowed;
    accent-color: #adb5bd; /* Gray when disabled */
  }
  
  .checkbox-label {
    font-size: 0.95rem;
    color: #333;
    cursor: pointer;
    user-select: none; /* Prevent text selection on label click */
  }

  .checkbox-label.disabled-label {
    color: #6c757d; /* Lighter text for disabled label */
    cursor: not-allowed;
  }
</style>
