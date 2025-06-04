import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Card from './Card.svelte';

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
      this.div.textContent = options.props.text || 'Default slot content';
      options.target.appendChild(this.div);
    }
  },
  // @ts-ignore
  props: {},
};


describe('Card.svelte', () => {
  it('renders with default slot content', () => {
    // @ts-ignore
    const { getByText } = render(Card, { props: { slots: { default: SlotContent } } });
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
        // @ts-ignore
        slots: { default: SlotContent }
      }
    });
    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Subtitle')).toBeInTheDocument();
    expect(getByText('Default slot content')).toBeInTheDocument();
  });
});
