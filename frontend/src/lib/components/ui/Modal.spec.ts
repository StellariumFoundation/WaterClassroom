import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import Modal from './Modal.svelte';
import DefaultSlotModalContent from './DefaultSlotModalContent.svelte';
import HeaderSlotModalContent from './HeaderSlotModalContent.svelte';
import FooterSlotModalContent from './FooterSlotModalContent.svelte';

describe('Modal.svelte', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(Modal, { props: { isOpen: false } });
    expect(container.querySelector('.modal-overlay')).toBeNull();
  });

  it('renders when isOpen is true', () => {
    render(Modal, {
      props: {
        isOpen: true,
        $$slots: { default: DefaultSlotModalContent }
      }
    });
    // Check for content from the slot, assuming SlotTestComponent renders identifiable text
    expect(screen.getByText('Default modal content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('displays the provided slot content', () => {
    render(Modal, {
      props: {
        isOpen: true,
        $$slots: { default: DefaultSlotModalContent }
      }
    });
    expect(screen.getByText('Default modal content')).toBeInTheDocument();
  });

  it('calls onClose prop when close button is clicked', async () => {
    const handleCloseMock = vi.fn();
    render(Modal, {
      props: {
        isOpen: true,
        onClose: handleCloseMock,
        $$slots: { default: DefaultSlotModalContent }
      }
    });
    const closeButton = screen.getByLabelText('Close modal');
    await fireEvent.click(closeButton);
    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });

  it('dispatches "close" event when close button is clicked and no onClose prop is given', async () => {
    const { component } = render(Modal, {
      props: {
        isOpen: true,
        $$slots: { default: DefaultSlotModalContent }
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
    render(Modal, {
      props: {
        isOpen: true,
        onClose: handleCloseMock,
        $$slots: { default: DefaultSlotModalContent }
      }
    });
    const overlay = screen.getByRole('dialog').parentElement;
    if (!overlay) throw new Error('Modal overlay not found');

    await fireEvent.click(overlay);
    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });

  it('dispatches "close" event when overlay is clicked and no onClose prop', async () => {
     const { component } = render(Modal, {
      props: {
        isOpen: true,
        $$slots: { default: DefaultSlotModalContent }
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
    render(Modal, {
      props: {
        isOpen: true,
        onClose: handleCloseMock,
        $$slots: { default: DefaultSlotModalContent }
      }
    });

    await fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });

  it('renders header slot content', () => {
    render(Modal, {
      props: {
        isOpen: true,
        $$slots: { header: HeaderSlotModalContent }
      }
    });
    expect(screen.getByText('Modal Header Test')).toBeInTheDocument();
  });

  it('renders footer slot content', () => {
    render(Modal, {
      props: {
        isOpen: true,
        $$slots: { footer: FooterSlotModalContent }
      }
    });
    expect(screen.getByText('Modal Footer Test')).toBeInTheDocument();
  });

});
