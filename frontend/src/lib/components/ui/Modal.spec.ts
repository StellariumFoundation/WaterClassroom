import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import Modal from './Modal.svelte';

// A simple component to use as slot content
const SlotContent = {
  Component: class {
    $set() {}
    $on() {}
    $destroy() {}
    // @ts-ignore
    $$prop_def = {};
    // @ts-ignore
    $$slot_def = {};
    // @ts-ignore
    $$events_def = {};
    constructor(options: any) {
      // @ts-ignore
      this.div = document.createElement('div');
      // @ts-ignore
      this.div.textContent = options.props.text || 'Default modal content';
      // @ts-ignore
      this.div.setAttribute('data-testid', 'slot-content');
      options.target.appendChild(this.div);
    }
  },
  // @ts-ignore
  props: {},
};

describe('Modal.svelte', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(Modal, { props: { isOpen: false } });
    // Check if the modal overlay (or any specific modal content) is not present
    expect(container.querySelector('.modal-overlay')).toBeNull();
  });

  it('renders when isOpen is true', () => {
    // @ts-ignore
    render(Modal, { props: { isOpen: true, slots: { default: SlotContent } } });
    expect(screen.getByTestId('slot-content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays the provided slot content', () => {
    // @ts-ignore
    render(Modal, { props: { isOpen: true, slots: { default: SlotContent } } });
    expect(screen.getByText('Default modal content')).toBeInTheDocument();
  });

  it('calls onClose prop when close button is clicked', async () => {
    const handleCloseMock = vi.fn();
    // @ts-ignore
    render(Modal, { props: { isOpen: true, onClose: handleCloseMock, slots: { default: SlotContent } } });
    const closeButton = screen.getByLabelText('Close modal');
    await fireEvent.click(closeButton);
    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });

  it('dispatches "close" event when close button is clicked and no onClose prop is given', async () => {
    const { component } = render(Modal, {
      props: {
        isOpen: true,
        // @ts-ignore
        slots: { default: SlotContent }
      }
    });
    const handleCloseEvent = vi.fn();
    component.$on('close', handleCloseEvent);

    const closeButton = screen.getByLabelText('Close modal');
    await fireEvent.click(closeButton);
    expect(handleCloseEvent).toHaveBeenCalledTimes(1);
  });

  it('calls onClose prop when overlay is clicked', async () => {
    const handleCloseMock = vi.fn();
    // @ts-ignore
    render(Modal, { props: { isOpen: true, onClose: handleCloseMock, slots: { default: SlotContent } } });
    // The overlay is the div with class 'modal-overlay'
    const overlay = screen.getByRole('dialog').parentElement;
    if (!overlay) throw new Error('Modal overlay not found');

    await fireEvent.click(overlay);
    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });

  it('dispatches "close" event when overlay is clicked and no onClose prop', async () => {
     const { component } = render(Modal, {
      props: {
        isOpen: true,
        // @ts-ignore
        slots: { default: SlotContent }
      }
    });
    const handleCloseEvent = vi.fn();
    component.$on('close', handleCloseEvent);

    const overlay = screen.getByRole('dialog').parentElement;
    if (!overlay) throw new Error('Modal overlay not found');

    await fireEvent.click(overlay);
    expect(handleCloseEvent).toHaveBeenCalledTimes(1);
  });

  it('calls onClose prop when Escape key is pressed', async () => {
    const handleCloseMock = vi.fn();
    // @ts-ignore
    render(Modal, { props: { isOpen: true, onClose: handleCloseMock, slots: { default: SlotContent } } });

    // Simulate Escape key press on the window
    await fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });

  it('renders header slot content', () => {
    render(Modal, {
      props: {
        isOpen: true,
        // @ts-ignore
        slots: { header: { Component: SlotContent, props: { text: 'Modal Header Test' } } }
      }
    });
    expect(screen.getByText('Modal Header Test')).toBeInTheDocument();
  });

  it('renders footer slot content', () => {
    render(Modal, {
      props: {
        isOpen: true,
        // @ts-ignore
        slots: { footer: { Component: SlotContent, props: { text: 'Modal Footer Test' } } }
      }
    });
    expect(screen.getByText('Modal Footer Test')).toBeInTheDocument();
  });

});
