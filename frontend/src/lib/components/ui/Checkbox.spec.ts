import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Checkbox from './Checkbox.svelte';

describe('Checkbox.svelte', () => {
  it('renders with a label', () => {
    const { getByLabelText } = render(Checkbox, { props: { label: 'Test Checkbox' } });
    expect(getByLabelText('Test Checkbox')).toBeInTheDocument();
  });

  it('changes its checked state when clicked', async () => {
    const { getByLabelText, component } = render(Checkbox, { props: { label: 'Test Checkbox', checked: false } });
    const checkboxInput = getByLabelText('Test Checkbox') as HTMLInputElement;

    expect(checkboxInput.checked).toBe(false);
    // Programmatic prop update (if needed for test setup)
    // await component.$set({ checked: false });
    // expect(checkboxInput.checked).toBe(false);

    await fireEvent.click(checkboxInput);
    expect(checkboxInput.checked).toBe(true);

    await fireEvent.click(checkboxInput);
    expect(checkboxInput.checked).toBe(false);
  });

  it('dispatches change event with the correct checked state', async () => {
    const { getByLabelText, component } = render(Checkbox, { props: { label: 'Test Checkbox', checked: false } });
    const checkboxInput = getByLabelText('Test Checkbox') as HTMLInputElement;
    const handleChange = vi.fn();
    component.$on('change', handleChange);

    await fireEvent.click(checkboxInput);
    expect(handleChange).toHaveBeenCalledTimes(1);
    // Event detail might not be directly the boolean value, it's often an Event object.
    // We need to check how the component dispatches the custom event.
    // Assuming it dispatches the checked value directly or in `event.detail`.
    // If the component uses `dispatch('change', newCheckedState)`, then this would work:
    // expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({ detail: true }));
    // For Svelte Testing Library, the event handler's argument is the component event,
    // which often has the value in `event.detail`.
    // Let's check the actual Svelte component's dispatch call.
    // If it's `dispatch('change', { checked: newCheckedState })`, then:
    // expect(handleChange.mock.calls[0][0].detail).toEqual({ checked: true });
    // If it's `dispatch('change', newCheckedState)`, then:
    expect(handleChange.mock.calls[0][0].detail).toBe(true);


    await fireEvent.click(checkboxInput);
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange.mock.calls[1][0].detail).toBe(false);
  });

  it('is disabled when disabled prop is true', () => {
    const { getByLabelText } = render(Checkbox, { props: { label: 'Test Checkbox', disabled: true } });
    const checkboxInput = getByLabelText('Test Checkbox') as HTMLInputElement;
    expect(checkboxInput.disabled).toBe(true);
  });

  it('renders with checked state true if prop is passed', () => {
    const { getByLabelText } = render(Checkbox, { props: { label: 'Test Checkbox', checked: true } });
    const checkboxInput = getByLabelText('Test Checkbox') as HTMLInputElement;
    expect(checkboxInput.checked).toBe(true);
  });
});
