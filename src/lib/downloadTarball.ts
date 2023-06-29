import { ok } from 'assert';
import { createWriteStream } from 'fs';
import { mkdtemp } from 'fs/promises';
import { tmpdir } from 'os';
import * as path from 'path';
import { Readable } from 'stream';
import { finished } from 'stream/promises';
import { fetch } from 'undici';
import type { URL } from 'url';

/**
 * Find and download a tarball from the registry.
 *
 * @returns the path to the downloaded tarball.
 */
export async function downloadTarball(url: URL): Promise<string> {
    const tmpDirectory = await mkdtemp(path.join(tmpdir(), `type-extractor-tarball`));
    const destinationFilepath = path.join(tmpDirectory, path.basename(url.pathname));

    const response = await fetch(url);

    ok(response.ok, `Response failed with status ${response.status}: ${response.statusText}`);

    await finished(Readable.fromWeb(response.body!).pipe(createWriteStream(destinationFilepath, { flags: 'wx' })));

    return destinationFilepath;
}
