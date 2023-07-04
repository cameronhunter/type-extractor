#!/usr/bin/env node

import { ParseArgsConfig, parseArgs } from 'node:util';
import { createTypesPackageFrom } from '../lib/createTypesPackageFrom';
import { ok } from 'node:assert';
import dedent from 'dedent';
import { rename } from 'node:fs/promises';
import path from 'node:path';

async function main(pkg: string, options: { directory?: string | undefined }) {
    const [packageName, version = 'latest'] = pkg.split('@');

    ok(packageName, 'Expected a package name to be provided.');

    const result = await createTypesPackageFrom(packageName, version);

    const destination = options.directory
        ? path.join(options.directory, path.basename(result.directory))
        : result.directory;

    if (options.directory) {
        await rename(result.directory, destination);
    }

    console.log(`Created ${result.name}@${result.version} in ${destination}.`);
}

const config = {
    allowPositionals: true,
    strict: true,
    options: {
        directory: {
            type: 'string',
            default: process.cwd(),
        },
        help: {
            type: 'boolean',
            short: 'h',
        },
    },
} satisfies ParseArgsConfig;

const { positionals, values } = parseArgs(config);

if (values['help']) {
    console.log(dedent`
        Usage: type-extractor <package-name>[@version] [options]

        Options:
            --directory     Directory to save the package (default: ${config.options.directory.default})
            --help, -h      Show this message

        Examples:
            type-extractor playwright-core          Extract the types for the latest version of playwright-core.
            type-extractor playwright-core@1.3.6    Extract the types for v1.3.6 of playwright-core.
    `);

    process.exit(0);
}

ok(positionals[0], 'Expected a package name as a positional argument.');

main(positionals[0], values).catch((e) => {
    console.error('Error:', e);
    process.exit(1);
});
