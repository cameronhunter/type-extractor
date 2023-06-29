import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export async function createTmpDirectory(): Promise<string> {
    return mkdtemp(join(tmpdir(), 'type-extractor-'));
}
