import { describe, test, expect } from 'vitest';
import { createTypesPackageJSON, rewriteExports } from '../src/lib/createPackageJSON';

describe('createTypesPackageJSON', () => {
    test('rewrites package.json for the new @types package', () => {
        const pkg = {
            name: 'playwright-core',
            version: '1.2.3',
        };

        expect(createTypesPackageJSON(pkg)).toEqual({
            name: '@types/playwright-core',
            version: '1.2.3',
        });
    });

    test('handling scoped packages', () => {
        const pkg = {
            name: '@playwright/core',
            version: '2.3.4',
        };

        expect(createTypesPackageJSON(pkg)).toEqual({
            name: '@types/playwright__core',
            version: '2.3.4',
        });
    });
});

describe('rewriteExports', () => {
    test('realistic exports', () => {
        const packageExports = {
            '.': {
                types: './index.d.ts',
                import: './index.mjs',
                require: './index.js',
                default: './index.js',
            },
            './package.json': './package.json',
            './lib/outofprocess': './lib/outofprocess.js',
            './lib/image_tools/stats': './lib/image_tools/stats.js',
            './lib/image_tools/compare': './lib/image_tools/compare.js',
            './lib/image_tools/imageChannel': './lib/image_tools/imageChannel.js',
            './lib/image_tools/colorUtils': './lib/image_tools/colorUtils.js',
            './lib/cli/cli': './lib/cli/cli.js',
            './lib/cli/program': './lib/cli/program.js',
            './lib/containers/docker': './lib/containers/docker.js',
            './lib/remote/playwrightServer': './lib/remote/playwrightServer.js',
            './lib/server': './lib/server/index.js',
            './lib/utils': './lib/utils/index.js',
            './lib/utilsBundle': './lib/utilsBundle.js',
            './lib/zipBundle': './lib/zipBundle.js',
            './types/protocol': './types/protocol.d.ts',
            './types/structs': './types/structs.d.ts',
        };

        expect(rewriteExports(packageExports)).toEqual({
            '.': { types: './index.d.ts' },
            './types/protocol': './types/protocol.d.ts',
            './types/structs': './types/structs.d.ts',
        });
    });
});
