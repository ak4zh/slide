import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import inlangPlugin from '@inlang/sdk-js/adapter-sveltekit';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

export default defineConfig({
	plugins: [inlangPlugin(), sveltekit(), purgeCss()]
});
