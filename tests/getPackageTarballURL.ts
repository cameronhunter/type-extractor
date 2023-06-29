import { test, expect, beforeAll, afterAll } from 'vitest';
import { PackageDetails, getPackageTarballURL } from '../src/lib/getPackageTarballURL';
import { MockAgent, setGlobalDispatcher } from 'undici';

let mockAgent: MockAgent;

beforeAll(() => {
    mockAgent = new MockAgent();
    mockAgent.disableNetConnect();
    setGlobalDispatcher(mockAgent);
});

afterAll(() => {
    mockAgent.deactivate();
});

test('returns the tarball URL for a package name', async () => {
    mockResponse('playwright-core', {
        'dist-tags': {
            latest: '1.35.1',
        },
        versions: {
            '1.35.1': {
                dist: {
                    tarball: 'https://registry.npmjs.org/playwright-core/-/playwright-core-1.35.1.tgz',
                },
            },
        },
    });

    const tarball = await getPackageTarballURL('playwright-core');

    expect(tarball.toString()).toBe('https://registry.npmjs.org/playwright-core/-/playwright-core-1.35.1.tgz');
});

/**
 * @see https://undici.nodejs.org/#/docs/best-practices/mocking-request
 */
function mockResponse(packageName: string, response: PackageDetails) {
    const mockPool = mockAgent.get('https://registry.npmjs.org');
    mockPool.intercept({ path: `/${packageName}` }).reply(200, response);
}
