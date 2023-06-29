/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
    test: {
        include: ['tests/**/*.?(c|m)[jt]s?(x)'],
    },
});
