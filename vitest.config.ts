import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['tests/**/*.?(c|m)[jt]s?(x)'],
    },
});
