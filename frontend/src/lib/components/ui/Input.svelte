<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let type: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' = 'text';
  export let value: string | number = '';
  export let placeholder: string = '';
  export let label: string | undefined = undefined;
  export let disabled: boolean = false;
  export let name: string | undefined = undefined; // Useful for forms

  const dispatch = createEventDispatcher();

  // Forward input events to allow for bind:value on the parent
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value; // Keep internal value in sync
    dispatch('input', event); // Forward the native event
  }
  
  // Forward change events
  function handleChange(event: Event) {
    dispatch('change', event);
  }
  
  // Forward other common input events if needed, e.g., blur, focus
  function handleBlur(event: FocusEvent) {
    dispatch('blur', event);
  }

  function handleFocus(event: FocusEvent) {
    dispatch('focus', event);
  }
  
  let id = label ? `input-${Math.random().toString(36).substring(2,9)}` : undefined;

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
    on:input={handleInput}
    on:change={handleChange}
    on:blur={handleBlur}
    on:focus={handleFocus}
  />
</div>

<style>
  .form-control {
    margin-bottom: 1rem; /* Spacing between form controls */
    display: flex;
    flex-direction: column;
  }

  .input-label {
    display: block;
    margin-bottom: 0.35rem;
    font-size: 0.9rem;
    color: #333; /* Darker label text */
    font-weight: 500;
  }

  .styled-input {
    width: 100%; /* Full width by default */
    padding: 0.6rem 0.75rem;
    border: 1px solid #ced4da; /* Standard Bootstrap-like border */
    border-radius: 4px;
    font-size: 1rem;
    line-height: 1.5;
    background-color: #fff;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    box-sizing: border-box; /* Important for width: 100% */
  }

  .styled-input:focus {
    border-color: #80bdff; /* Blue focus highlight */
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  .styled-input::placeholder {
    color: #6c757d; /* Gray placeholder */
    opacity: 1;
  }

  .styled-input:disabled {
    background-color: #e9ecef; /* Gray out when disabled */
    opacity: 0.7;
    cursor: not-allowed;
  }
</style>
