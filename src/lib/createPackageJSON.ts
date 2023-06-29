import { getPackageDirectoryName } from './getPackageDirectoryName';

export interface PackageJSON {
    name: string;
    exports?: { [path: string]: string | { types?: string } } | undefined;
    [other: string]: unknown;
}

export function createTypesPackageJSON(packageJSON: PackageJSON): PackageJSON {
    // TODO: Find all dependencies in type definitions and remove others.

    return {
        ...packageJSON,
        name: `@types/${getPackageDirectoryName(packageJSON.name)}`,
        exports: rewriteExports(packageJSON.exports),

        /**
         * Remove these properties, as they have nothing to do with types.
         */
        bin: undefined,
        devDependencies: undefined,
        engines: undefined,
        files: undefined,
        main: undefined,
        repository: undefined,
        scripts: undefined,
        peerDependencies: undefined,
        peerDependenciesMeta: undefined,
    };
}

/**
 * Rewrite package exports to filter out anything that isn't type-related.
 */
export function rewriteExports(packageExports: PackageJSON['exports'] | undefined): PackageJSON['exports'] | undefined {
    if (!packageExports) {
        return undefined;
    }

    return Object.entries(packageExports).reduce((state, [key, value]) => {
        if (typeof value === 'string') {
            if (key.endsWith('.d.ts') || value.endsWith('.d.ts')) {
                state[key] = value;
            }
        } else {
            if (value.types) {
                state[key] = { types: value.types };
            }
        }

        return state;
    }, {} as Exclude<PackageJSON['exports'], undefined>);
}
