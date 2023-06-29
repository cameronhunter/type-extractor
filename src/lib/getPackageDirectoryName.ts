/**
 * Creating `@types` packages for scoped packages requires a special naming
 * convention of `@types/scope__package`.
 */
export function getPackageDirectoryName(packageName: string): string {
    const [_, scope, name] = packageName.match(/(?:@(.+)\/)(.+)/) || [undefined, undefined, packageName];
    return scope ? `${scope}__${name}` : name;
}
