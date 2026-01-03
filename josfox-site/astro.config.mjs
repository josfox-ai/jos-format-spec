import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
    site: 'https://josfox-ai.github.io',
    base: '/jos-format-spec',
    integrations: [mdx()],
    output: 'static'
});
