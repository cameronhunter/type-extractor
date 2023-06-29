import { doesNotMatch } from 'assert';
import { mkdtemp, rename, writeFile } from 'fs/promises';
import * as path from 'path';
import { getPackageDirectoryName } from './getPackageDirectoryName';
import { getPackageTarballURL } from './getPackageTarballURL';
import { downloadTarball } from './downloadTarball';
import { extractTarball } from './extractTarball';
import { tmpdir } from 'os';
import { createTypesPackageJSON } from './createPackageJSON';

export async function createTypesPackageFrom(packageName: string, version?: string): Promise<string> {
    doesNotMatch(packageName, /^@types\/.+/, `There's no need to extract types from a DefinitelyTyped package.`);

    const url = await getPackageTarballURL(packageName, version);
    const tarball = await downloadTarball(url);
    const packageDirectory = await extractTarball(tarball, ['package.json', '**/*.d.ts', 'LICENSE*']);

    // TODO: Validate that there are at least some types in the package directory.

    const packageJSONPath = path.join(packageDirectory, 'package.json');

    await writeFile(
        packageJSONPath,
        JSON.stringify(createTypesPackageJSON(require(packageJSONPath)), null, 2),
        'utf-8'
    );

    const destinationDirectory = path.join(await mkdtemp(tmpdir()), getPackageDirectoryName(packageName));

    await rename(packageDirectory, destinationDirectory);

    return destinationDirectory;
}
