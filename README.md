# `@cameronhunter/type-extractor`

[![CI](https://github.com/cameronhunter/type-extractor/actions/workflows/CI.yml/badge.svg)](https://github.com/cameronhunter/type-extractor/actions/workflows/CI.yml)

Extract TypeScript type definitions from npm packages.

```plain
Usage: type-extractor <package-name> [options]

Options:
    --version       Package version (default: latest)
    --directory     Directory to save the package (default: /Users/chunter/workspace/github/cameronhunter/type-extractor)
    --help, -h      Show this message

Examples:
    type-extractor playwright-core                   Extract the types for the latest version of playwright-core.
    type-extractor playwright-core --version 1.3.6   Extract the types for v1.3.6 of playwright-core.
```

Using `npx`:

```sh
$ npx @cameronhunter/type-extractor <package-name> [options]
```
