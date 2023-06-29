import { ok } from 'node:assert';
import { createWriteStream } from 'node:fs';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import * as path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fetch } from 'undici';
import type { URL } from 'node:url';

/**
 * Find and download a tarball from the registry.
 *
 * @returns the path to the downloaded tarball.
 */
export async function downloadTarball(url: URL): Promise<string> {
    const tmpDirectory = await mkdtemp(tmpdir());
    const destinationFilepath = path.join(tmpDirectory, path.basename(url.pathname));

    const response = await fetch(url);

    ok(response.ok, `Response failed with status ${response.status}: ${response.statusText}`);

    await pipeline(response.body!, createWriteStream(destinationFilepath, { flags: 'wx' }));

    return destinationFilepath;
}
