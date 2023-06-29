import { getPackageDirectoryName } from './getPackageDirectoryName';
import depcheck, { PackageDependencies } from 'depcheck';

export interface PackageJSON {
    name: string;
    exports?: { [path: string]: string | { types?: string } } | undefined;
    dependencies?: PackageDependencies | undefined;
    [other: string]: unknown;
}

export async function createTypesPackageJSON(packageDirectory: string, packageJSON: PackageJSON): Promise<PackageJSON> {
    return {
        ...packageJSON,
        name: rewriteName(packageJSON.name),
        exports: rewriteExports(packageJSON.exports),
        dependencies: await rewriteDependencies(packageDirectory, packageJSON['dependencies']),

        /**
         * Remove these properties, as they have nothing to do with types.
         */
        bin: undefined,
        devDependencies: undefined,
        engines: undefined,
        files: undefined,
        main: undefined,
        optionalDependencies: undefined,
        peerDependencies: undefined,
        peerDependenciesMeta: undefined,
        repository: undefined,
        scripts: undefined,

        /**
         * Remove a few random properties
         */
        husky: undefined,
        jest: undefined,
        prettier: undefined,
        wireit: undefined,
    };
}

export function rewriteName(name: string): string {
    return `@types/${getPackageDirectoryName(name)}`;
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

/**
 * Remove dependencies that aren't used in the type definitions.
 */
async function rewriteDependencies(
    packageDirectory: string,
    dependencies: PackageDependencies | undefined
): Promise<PackageDependencies | undefined> {
    if (!dependencies) {
        return undefined;
    }

    const { using } = await depcheck(packageDirectory, {
        ignoreBinPackage: true,
        skipMissing: true,
        parsers: {
            '**/*.d.ts': depcheck.parser.typescript,
        },
        detectors: [depcheck.detector.importDeclaration],
        package: {
            dependencies,
        },
    });

    return Object.keys(using).reduce((state, dependency) => {
        state[dependency] = dependencies[dependency]!;
        return state;
    }, {} as PackageDependencies);
}
