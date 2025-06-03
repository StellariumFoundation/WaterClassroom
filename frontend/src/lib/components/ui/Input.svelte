<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';

  export let type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' = 'text';
  export let value: string | number = '';
  export let placeholder: string = '';
  export let label: string | undefined = undefined;
  export let disabled: boolean = false;
  export let name: string | undefined = undefined; // Useful for forms
  export let id: string | undefined = undefined; // Allow passing ID for label association

  const dispatch = createEventDispatcher();

  // Generate a unique ID if not provided, for label association
  onMount(() => {
    if (!id && label) {
      id = `input-${Math.random().toString(36).substring(2, 9)}`;
    }
  });

  // Forward events to allow for bind:value and other event handling on parent
  function handleEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    if (event.type === 'input') { // Keep internal value in sync for bind:value
      value = target.value;
    }
    dispatch(event.type, event);
  }

</script>

<div class="form-control">
  {#if label}
    <label for={id} class="input-label">{label}</label>
  {/if}
  <input
    {id}
    {name}
    {type}
    bind:value={value}
    {placeholder}
    {disabled}
    class="styled-input"
    on:input={handleEvent}
    on:change={handleEvent}
    on:blur={handleEvent}
    on:focus={handleEvent}
    on:keydown={handleEvent}
    on:keyup={handleEvent}
  />
</div>

<style>
  .form-control {
    margin-bottom: var(--spacing-lg); /* 16px */
    display: flex;
    flex-direction: column;
  }

  .input-label {
    display: block;
    margin-bottom: var(--spacing-sm); /* 8px */
    font-family: var(--font-family-system);
    font-size: var(--font-size-small); /* 14px */
    color: var(--neutral-text-subtle);
    font-weight: var(--font-weight-medium); /* 500 */
  }

  .styled-input {
    width: 100%;
    padding: var(--spacing-md) var(--spacing-lg); /* 12px 16px -- more padding */
    border: 1px solid var(--neutral-border);
    border-radius: var(--border-radius-base); /* 6px */
    font-family: var(--font-family-system);
    font-size: var(--font-size-body); /* 16px */
    line-height: var(--line-height-base);
    background-color: var(--neutral-white); /* Or a specific input background if defined */
    color: var(--neutral-text-body);
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    box-sizing: border-box;
  }

  .styled-input:focus, .styled-input:focus-visible {
    border-color: var(--primary-blue);
    outline: 0;
    box-shadow: 0 0 0 3px var(--primary-blue-lighter); /* Subtle focus ring */
  }

  .styled-input::placeholder {
    color: var(--neutral-text-subtle);
    opacity: 1;
  }

  .styled-input:disabled {
    background-color: var(--neutral-bg); /* Lighter background for disabled */
    color: var(--neutral-text-subtle);
    opacity: 0.7;
    cursor: not-allowed;
  }
</style>
