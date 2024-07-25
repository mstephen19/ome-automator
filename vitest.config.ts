import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        setupFiles: ['./tests/content/setup.ts'],
        isolate: true,
    },
});
