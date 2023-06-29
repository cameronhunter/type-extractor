import { ok } from 'node:assert';
import { createWriteStream } from 'node:fs';
import { join, basename } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fetch } from 'undici';
import type { URL } from 'node:url';
import { createTmpDirectory } from './createTmpDirectory';

/**
 * Find and download a tarball from the registry.
 *
 * @returns the path to the downloaded tarball.
 */
export async function downloadTarball(url: URL): Promise<string> {
    const tmpDirectory = await createTmpDirectory();
    const destinationFilepath = join(tmpDirectory, basename(url.pathname));

    const response = await fetch(url);

    ok(response.ok, `Response failed with status ${response.status}: ${response.statusText}`);

    await pipeline(response.body!, createWriteStream(destinationFilepath, { flags: 'wx' }));

    return destinationFilepath;
}
