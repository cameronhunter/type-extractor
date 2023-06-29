import { mkdtemp } from 'node:fs/promises';
import * as path from 'node:path';
import { tmpdir } from 'node:os';
import { extract } from 'tar';
import { minimatch } from 'minimatch';

export async function extractTarball(file: string, filter: string[] = []): Promise<string> {
    const tmpDirectory = await mkdtemp(tmpdir());

    // Files in the tarball all in a top-level `package` directory that we don't want.
    const strip = 1;

    await extract({
        file,
        cwd: tmpDirectory,
        strip,
        filter(filePath) {
            filePath = filePath.split(path.sep).slice(strip).join(path.sep);
            return filter.length === 0 || filter.some((filter) => minimatch(filePath, filter));
        },
    });

    return tmpDirectory;
}
