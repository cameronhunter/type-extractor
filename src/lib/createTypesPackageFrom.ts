import { doesNotMatch, ok } from 'node:assert';
import { rename, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { getPackageDirectoryName } from './getPackageDirectoryName';
import { getPackageTarballURL } from './getPackageTarballURL';
import { downloadTarball } from './downloadTarball';
import { extractTarball } from './extractTarball';
import { createTypesPackageJSON } from './createPackageJSON';
import { existsSync } from 'node:fs';
import { createTmpDirectory } from './createTmpDirectory';
import dedent from 'dedent';

export async function createTypesPackageFrom(
    packageName: string,
    version?: string
): Promise<{ name: string; version: string; directory: string }> {
    doesNotMatch(packageName, /^@types\/.+/, `There's no need to extract types from a DefinitelyTyped package.`);

    const url = await getPackageTarballURL(packageName, version);
    const tarball = await downloadTarball(url);
    const packageDirectory = await extractTarball(tarball, ['package.json', '**/*.d.ts', 'LICENSE*']);

    const packageJSONPath = join(packageDirectory, 'package.json');
    const packageJSON = require(packageJSONPath);

    ok(
        existsSync(resolve(packageDirectory, packageJSON.types || 'index.d.ts')),
        `Expected type definitions to exist in ${packageName}@${packageJSON.version}.`
    );

    const newPackageName = getPackageDirectoryName(packageName);
    const newPackageJSON = await createTypesPackageJSON(packageDirectory, packageJSON);

    await writeFile(packageJSONPath, JSON.stringify(newPackageJSON, null, 2), 'utf-8');

    await writeFile(
        join(packageDirectory, 'README.md'),
        dedent`
            # \`${newPackageJSON.name}\`

            Typescript type definitions extracted from [\`${packageName}@${packageJSON.version}\`](https://www.npmjs.com/package/${packageName})
            by [\`type-extractor\`](https://www.npmjs.com/package/@cameronhunter/type-extractor).

            \`\`\`sh
            $ npx @cameronhunter/type-extractor ${packageName}@${packageJSON.version}
            \`\`\`\n
            `,
        'utf-8'
    );

    const destinationDirectory = join(await createTmpDirectory(), newPackageName);

    await rename(packageDirectory, destinationDirectory);

    return {
        name: newPackageJSON.name,
        version: newPackageJSON.version,
        directory: destinationDirectory,
    };
}
