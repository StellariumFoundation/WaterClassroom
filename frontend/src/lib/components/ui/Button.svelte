<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'tertiary' | 'danger' = 'primary';
  export let onClick: (() => void) | undefined = undefined;
  export let disabled: boolean = false;

  // Base classes + variant specific classes
  $: buttonClass = `btn btn-${variant}`;

  const handleClick = () => {
    if (onClick && !disabled) {
      onClick();
    }
  };
</script>

<button class={buttonClass} on:click={handleClick} {disabled}>
  <slot />
</button>

<style>
  .btn {
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: 1px solid transparent;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1.5; /* Ensure text is vertically centered nicely */
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Primary Button */
  .btn-primary {
    background-color: #007bff; /* Blue */
    color: white;
    border-color: #007bff;
  }
  .btn-primary:not(:disabled):hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }

  /* Secondary Button */
  .btn-secondary {
    background-color: #6c757d; /* Gray */
    color: white;
    border-color: #6c757d;
  }
  .btn-secondary:not(:disabled):hover {
    background-color: #545b62;
    border-color: #545b62;
  }

  /* Tertiary Button (e.g., outline or lighter style) */
  .btn-tertiary {
    background-color: #f8f9fa; /* Light Gray */
    color: #212529; /* Dark text */
    border-color: #ced4da; /* Gray border */
  }
  .btn-tertiary:not(:disabled):hover {
    background-color: #e2e6ea;
    border-color: #dae0e5;
  }
  
  /* Danger Button */
  .btn-danger {
    background-color: #dc3545; /* Red */
    color: white;
    border-color: #dc3545;
  }
  .btn-danger:not(:disabled):hover {
    background-color: #c82333;
    border-color: #c82333;
  }
</style>
