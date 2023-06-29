import { ok } from 'node:assert';
import { fetch } from 'undici';
import { URL } from 'node:url';

export interface PackageDetails {
    'dist-tags': { [tag: string]: string };
    versions: { [version: string]: { dist: { tarball: string } } };
}

/**
 * Use the npm registry to find the tarball URL for a particular version of a
 * package.
 *
 * @returns the URL to the package tarball.
 */
export async function getPackageTarballURL(packageName: string, version: string = 'latest'): Promise<URL> {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);

    ok(response.ok, `Response failed with status ${response.status}: ${response.statusText}`);

    const packageDetails = (await response.json()) as PackageDetails;

    if (version in packageDetails['dist-tags']) {
        const distTagVersion = packageDetails['dist-tags'][version];
        ok(distTagVersion, `Expected a ${version} dist-tag version to exist.`);
        version = distTagVersion;
    }

    const tarball = packageDetails.versions[version]?.dist.tarball;

    ok(tarball, `Expected a tarball to exist for version "${version}".`);

    return new URL(tarball);
}
