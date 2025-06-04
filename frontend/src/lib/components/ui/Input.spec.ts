import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Input from './Input.svelte';

describe('Input.svelte', () => {
  it('renders with default props', () => {
    const { getByPlaceholderText } = render(Input);
    expect(getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });

  it('renders with a custom placeholder', () => {
    const { getByPlaceholderText } = render(Input, { props: { placeholder: 'Type here' } });
    expect(getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('value changes when typed into', async () => {
    const { getByPlaceholderText, component } = render(Input);
    const inputElement = getByPlaceholderText('Enter text...') as HTMLInputElement;
    await fireEvent.input(inputElement, { target: { value: 'Hello' } });
    expect(inputElement.value).toBe('Hello');
    // Check component prop if it's bound
    // This requires the component to have a `value` prop that is bound with `bind:value`
    // For this example, let's assume `value` is a prop that reflects the input's current value.
    // If Input.svelte uses `export let value = '';` and `<input bind:value ...>`
    // then the following would also work:
    // expect(component.value).toBe('Hello');
  });

  it('is disabled when disabled prop is true', () => {
    const { getByPlaceholderText } = render(Input, { props: { disabled: true } });
    const inputElement = getByPlaceholderText('Enter text...') as HTMLInputElement;
    expect(inputElement.disabled).toBe(true);
  });
});
