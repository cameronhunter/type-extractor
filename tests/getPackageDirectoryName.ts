import { test, expect } from 'vitest';
import { getPackageDirectoryName } from '../src/lib/getPackageDirectoryName';

const suite = test.each`
    packageName           | expectation
    ${'playwright-core'}  | ${'playwright-core'}
    ${'@playwright/core'} | ${'playwright__core'}
`;

suite('$packageName -> $expectation', ({ packageName, expectation }) => {
    expect(getPackageDirectoryName(packageName)).toBe(expectation);
});
