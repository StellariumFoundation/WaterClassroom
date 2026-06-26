// CSS is built separately by Tailwind CLI in build.ts
import App from './App.svelte';
import { mount } from 'svelte';

const app = mount(App, {
  target: document.getElementById('root')!,
});

export default app;
