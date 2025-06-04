import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
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

    it('is rendered when isOpen is true', () => {
      render(AITutorChat, { props: { isOpen: true } });
      expect(screen.getByRole('dialog', { name: 'AI Tutor' })).toBeInTheDocument();
      expect(screen.getByText("Hello! I'm your AI Tutor. How can I help you with your lessons today?")).toBeInTheDocument();
    });

    it('shows initial AI welcome message when chat opens', () => {
      render(AITutorChat, { props: { isOpen: true } });
      const welcomeMessage = screen.getByText(/Hello! I'm your AI Tutor/i);
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
      const aiMessagePromise = waitFor(() => {
        const aiMessages = screen.getAllByText(/Thinking about "Test user message..."/i);
        expect(aiMessages.length).toBeGreaterThan(0);
        expect(aiMessages[0].closest('.message-wrapper.ai')).not.toBeNull();
      });

      await vi.advanceTimersByTimeAsync(1200);
      await aiMessagePromise; // Ensure the AI message has rendered
    });

    it('sending a message (Enter key) adds user message and queues AI response', async () => {
      render(AITutorChat, { props: { isOpen: true } });
      const textarea = screen.getByPlaceholderText('Ask a question...');

      await fireEvent.input(textarea, { target: { value: 'Another test' } });
      await fireEvent.keyDown(textarea, { key: 'Enter', code: 'Enter' });

      expect(screen.getByText('Another test')).toBeInTheDocument();
      expect(screen.getByText('Another test').closest('.message-wrapper.user')).not.toBeNull();

      const aiMessagePromise = waitFor(() => {
        const aiMessages = screen.getAllByText(/Thinking about "Another test..."/i);
        expect(aiMessages.length).toBeGreaterThan(0);
        expect(aiMessages[0].closest('.message-wrapper.ai')).not.toBeNull();
      });
      await vi.advanceTimersByTimeAsync(1200);
      await aiMessagePromise;
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

      // The overlay is the parent of .chat-widget with role 'dialog'
      const overlay = screen.getByRole('dialog', { name: 'AI Tutor' }).parentElement;
      if (!overlay) throw new Error('Chat overlay not found');

      // Click the overlay itself, not its children
      await fireEvent.click(overlay);
      expect(closeHandler).toHaveBeenCalledTimes(1);
    });
  });

  // Test Suite 4: Input Handling
  describe('Input Handling', () => {
    it('Shift+Enter in textarea creates a new line, does not send', async () => {
      render(AITutorChat, { props: { isOpen: true } });
      const textarea = screen.getByPlaceholderText('Ask a question...') as HTMLTextAreaElement;
      const initialMessages = screen.getAllByRole('generic', { name: /message bubble/i }); // A way to count messages

      await fireEvent.input(textarea, { target: { value: 'First line' } });
      await fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
      await fireEvent.input(textarea, { target: { value: textarea.value + '\nSecond line' } }); // Simulate newline effect

      expect(textarea.value).toBe('First line\nSecond line');

      // Check that no new message was sent (message count remains the same, or no user message with this content)
      // This requires a more robust way to count messages or check their content if possible.
      // For simplicity, we'll check if the message "First line\nSecond line" is NOT present as a sent message.
      expect(screen.queryByText('First line\nSecond line')).toBeNull();

      // Ensure send was not called (no new messages beyond initial + any auto-responses from other tests if not isolated)
      const currentMessages = screen.getAllByRole('generic', { name: /message bubble/i });
      expect(currentMessages.length).toEqual(initialMessages.length); // Assuming no other messages were added
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
