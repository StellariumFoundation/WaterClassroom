import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Card from './Card.svelte';
import SlotTestComponent from './SlotTestComponent.svelte';

describe.skip('Card.svelte', () => {
  it('renders with default slot content', () => {
    const { getByText } = render(Card, {
      props: {
        $$slots: { default: [SlotTestComponent] },
        $$scope: {}
      }
    });
    expect(getByText('Default slot content')).toBeInTheDocument();
  });

  it('renders with a title if title prop is provided', () => {
    const { getByText } = render(Card, { props: { title: 'Test Title' } });
    expect(getByText('Test Title')).toBeInTheDocument();
  });

  it('renders with a subtitle if subtitle prop is provided', () => {
    const { getByText } = render(Card, { props: { subtitle: 'Test Subtitle' } });
    expect(getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders with title, subtitle and default slot content', () => {
    const { getByText } = render(Card, {
      props: {
        title: 'Test Title',
        subtitle: 'Test Subtitle',
        $$slots: { default: [SlotTestComponent] },
        $$scope: {}
      }
    });
    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Subtitle')).toBeInTheDocument();
    expect(getByText('Default slot content')).toBeInTheDocument();
  });
});
