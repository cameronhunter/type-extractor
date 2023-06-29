import { expect, test, beforeAll, afterAll } from 'vitest';
import { downloadTarball } from '../src/lib/downloadTarball';
import { URL } from 'url';
import { MockAgent, setGlobalDispatcher } from 'undici';
import { readFile } from 'fs/promises';

let mockAgent: MockAgent;

beforeAll(() => {
    mockAgent = new MockAgent();
    mockAgent.disableNetConnect();
    setGlobalDispatcher(mockAgent);
});

afterAll(() => {
    mockAgent.deactivate();
});

test('downloads the tarball', async () => {
    const url = new URL('https://registry.npmjs.org/playwright-core/-/playwright-core-1.35.1.tgz');
    const response = JSON.stringify({ fake: 'file' });

    mockResponse(url, response);

    const filePath = await downloadTarball(url);

    expect(await readFile(filePath, 'utf-8')).toEqual(response);
});

/**
 * @see https://undici.nodejs.org/#/docs/best-practices/mocking-request
 */
function mockResponse(url: URL, response: string) {
    const mockPool = mockAgent.get(`${url.protocol}//${url.host}`);
    mockPool.intercept({ path: url.pathname }).reply(200, response);
}
