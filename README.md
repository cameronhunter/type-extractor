# `@cameronhunter/type-extractor`

[![npm package](https://img.shields.io/npm/v/%40cameronhunter/type-extractor)](https://www.npmjs.com/package/@cameronhunter/type-extractor)
[![CI Status](https://github.com/cameronhunter/type-extractor/actions/workflows/CI.yml/badge.svg)](https://github.com/cameronhunter/type-extractor/actions/workflows/CI.yml)

Extract TypeScript type definitions from npm packages.

```plain
Usage: type-extractor <package-name>[@version] [options]

Options:
    --directory     Directory to save the package (default: /Users/chunter/workspace/github/cameronhunter/type-extractor)
    --help, -h      Show this message

Examples:
    type-extractor playwright-core        Extract the types for the latest version of playwright-core.
    type-extractor playwright-core@1.3.6  Extract the types for v1.3.6 of playwright-core.
```

Using `npx`:

```sh
$ npx @cameronhunter/type-extractor <package-name>[@version] [options]
```
