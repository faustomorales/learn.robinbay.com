import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [tailwindcss(), sveltekit(), Icons({
        compiler: 'svelte',
        autoInstall: true,
    })],
    optimizeDeps: {
        exclude: ["svelte-codemirror-editor", "codemirror", "@codemirror/language-javascript" /* ... */],
    },
    server: {
        host: true,
    },
    resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined
});
