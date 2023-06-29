import { sep } from 'node:path';
import { extract } from 'tar';
import { minimatch } from 'minimatch';
import { createTmpDirectory } from './createTmpDirectory';

export async function extractTarball(file: string, filter: string[] = []): Promise<string> {
    const tmpDirectory = await createTmpDirectory();

    // Files in the tarball all in a top-level `package` directory that we don't want.
    const strip = 1;

    await extract({
        file,
        cwd: tmpDirectory,
        strip,
        filter(filePath) {
            filePath = filePath.split(sep).slice(strip).join(sep);
            return filter.length === 0 || filter.some((filter) => minimatch(filePath, filter));
        },
    });

    return tmpDirectory;
}
