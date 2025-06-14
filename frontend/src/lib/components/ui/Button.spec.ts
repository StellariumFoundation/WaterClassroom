import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Button.svelte', () => {
  it('renders with default props', () => {
    const { getByText } = render(Button);
    expect(getByText('Submit')).toBeInTheDocument();
  });

  it('renders with a custom label', () => {
    const { getByText } = render(Button, { props: { label: 'Click me' } });
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('fires click event when clicked', async () => {
    const { getByText, component } = render(Button);
    const button = getByText('Submit');
    const mock = vi.fn();
    component.$on('click', mock);
    await fireEvent.click(button);
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const { getByText } = render(Button, { props: { disabled: true } });
    const button = getByText('Submit') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });
});
