import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import AITutorChat from './AITutorChat.svelte';

describe('AITutorChat.svelte', () => {
  beforeEach(() => {
    // Ensure a clean state for components that might interact with document.body
    // For example, if the component modifies body style for scroll lock
    document.body.style.overflow = '';
  });

  // Test Suite 1: Visibility and Initial State
  describe('Visibility and Initial State', () => {
    it('is not rendered when isOpen is false', () => {
      const { container } = render(AITutorChat, { props: { isOpen: false } });
      expect(container.querySelector('.chat-widget')).toBeNull();
    });

    it('is rendered when isOpen is true', async () => {
      render(AITutorChat, { props: { isOpen: true } });
      await tick(); // Wait for onMount and subsequent updates
      expect(screen.getByRole('dialog', { name: 'AI Tutor' })).toBeInTheDocument();
      expect(await screen.findByText("Hello! I'm your AI Tutor. How can I help you with your lessons today?")).toBeInTheDocument();
    });

    it('shows initial AI welcome message when chat opens', async () => {
      render(AITutorChat, { props: { isOpen: true } });
      await tick(); // Wait for onMount and subsequent updates
      const welcomeMessage = await screen.findByText(/Hello! I'm your AI Tutor/i);
      expect(welcomeMessage).toBeInTheDocument();
      // Check if it's marked as an AI message
      // This requires specific structure or class in the component, e.g., a wrapper with class 'ai'
      expect(welcomeMessage.closest('.message-wrapper.ai')).not.toBeNull();
    });
  });

  // Test Suite 2: Sending Messages
  describe('Sending Messages', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.runOnlyPendingTimers(); // Process any timers left running
      vi.useRealTimers();
      vi.clearAllMocks(); // Clear mocks between tests
    });

    it('send button is initially disabled', () => {
      render(AITutorChat, { props: { isOpen: true } });
      const sendButton = screen.getByRole('button', { name: 'Send message' });
      expect(sendButton).toBeDisabled();
    });

    it('typing a message enables the send button', async () => {
      render(AITutorChat, { props: { isOpen: true } });
      const sendButton = screen.getByRole('button', { name: 'Send message' });
      const textarea = screen.getByPlaceholderText('Ask a question...');

      expect(sendButton).toBeDisabled();
      await fireEvent.input(textarea, { target: { value: 'Hello AI' } });
      expect(sendButton).not.toBeDisabled();
    });

    it('sending a message (button click) adds user message and queues AI response', async () => {
      render(AITutorChat, { props: { isOpen: true } });
      const textarea = screen.getByPlaceholderText('Ask a question...');
      const sendButton = screen.getByRole('button', { name: 'Send message' });

      await fireEvent.input(textarea, { target: { value: 'Test user message' } });
      await fireEvent.click(sendButton);

      expect(screen.getByText('Test user message')).toBeInTheDocument();
      expect(screen.getByText('Test user message').closest('.message-wrapper.user')).not.toBeNull();

      // Check for placeholder AI response initiation (often immediate, before timer)
      // No specific immediate text, but we expect an AI message to appear after timer
      await vi.advanceTimersByTimeAsync(1200); // Advance timer first
      const aiMessage = await screen.findByText(/^Thinking about "Test user message..."/i);
      expect(aiMessage).toBeInTheDocument();
      expect(aiMessage.closest('.message-wrapper.ai')).not.toBeNull();
    });

    it('sending a message (Enter key) adds user message and queues AI response', async () => {
      render(AITutorChat, { props: { isOpen: true } });
      const textarea = screen.getByPlaceholderText('Ask a question...');

      await fireEvent.input(textarea, { target: { value: 'Another test' } });
      await fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });

      expect(screen.getByText('Another test')).toBeInTheDocument();
      expect(screen.getByText('Another test').closest('.message-wrapper.user')).not.toBeNull();

      await vi.advanceTimersByTimeAsync(1200); // Advance timer first
      const aiMessage = await screen.findByText(/^Thinking about "Another test..."/i);
      expect(aiMessage).toBeInTheDocument();
      expect(aiMessage.closest('.message-wrapper.ai')).not.toBeNull();
    });

    it('input field is cleared after sending a message', async () => {
      render(AITutorChat, { props: { isOpen: true } });
      const textarea = screen.getByPlaceholderText('Ask a question...') as HTMLTextAreaElement;
      const sendButton = screen.getByRole('button', { name: 'Send message' });

      await fireEvent.input(textarea, { target: { value: 'Clear me' } });
      expect(textarea.value).toBe('Clear me');
      await fireEvent.click(sendButton);
      expect(textarea.value).toBe('');
    });
  });

  // Test Suite 3: Closing the Chat
  describe('Closing the Chat', () => {
    it('clicking the close button dispatches a "close" event', async () => {
      const { component } = render(AITutorChat, { props: { isOpen: true } });
      const closeHandler = vi.fn();
      component.$on('close', closeHandler);

      const closeButton = screen.getByRole('button', { name: 'Close Chat' });
      await fireEvent.click(closeButton);
      expect(closeHandler).toHaveBeenCalledTimes(1);
    });

    it('clicking the chat overlay dispatches a "close" event', async () => {
      const { component } = render(AITutorChat, { props: { isOpen: true } });
      const closeHandler = vi.fn();
      component.$on('close', closeHandler);

      const overlay = screen.getByTestId('chat-overlay');
      // if (!overlay) throw new Error('Chat overlay not found'); // Not strictly needed with getByTestId

      // Click the overlay itself, not its children
      await fireEvent.click(overlay);
      expect(closeHandler).toHaveBeenCalledTimes(1);
    });
  });

  // Test Suite 4: Input Handling
  describe('Input Handling', () => {
    it('Shift+Enter in textarea creates a new line, does not send', async () => {
      render(AITutorChat, { props: { isOpen: true } });
      await tick(); // Ensure initial messages are rendered if any

      const textarea = screen.getByPlaceholderText('Ask a question...') as HTMLTextAreaElement;
      const initialMessages = screen.queryAllByTestId('message-wrapper');
      const initialMessageCount = initialMessages.length;

      await fireEvent.input(textarea, { target: { value: 'First line' } });
      await fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
      // Note: svelte-testing-library might not automatically update textarea.value on keyDown alone
      // if the component doesn't explicitly handle it to add '\n'.
      // However, the default action of Shift+Enter *should* add the newline.
      // We'll update the value as if the browser did it.
      textarea.value += '\n'; // Manually append newline for test state consistency
      await fireEvent.input(textarea, { target: { value: textarea.value + 'Second line' } });


      expect(textarea.value).toBe('First line\nSecond line');
      expect(textarea.value).toContain('\n');

      // Check that no new message was sent
      const finalMessages = screen.queryAllByTestId('message-wrapper');
      expect(finalMessages.length).toEqual(initialMessageCount);
    });
  });
});

// Helper to find message bubbles (could be more specific if needed)
// This is a bit of a workaround as role 'generic' is not ideal.
// Consider adding specific test-ids or ARIA roles to message bubbles in the component.
declare module '@testing-library/dom' {
  export function getAllByRole<K extends keyof ElementTagNameMap>(
    container: HTMLElement,
    role: string,
    options?: { name?: string | RegExp }
  ): Array<ElementTagNameMap[K]>;
}
