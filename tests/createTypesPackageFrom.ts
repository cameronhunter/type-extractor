import { test, expect } from 'vitest';
import { createTypesPackageFrom } from '../src/lib/createTypesPackageFrom';
import isCI from 'is-ci';

test('Throws an error when using @types packages', async () => {
    await expect(createTypesPackageFrom('@types/puppeteer')).rejects.toThrowErrorMatchingInlineSnapshot(
        '"There\'s no need to extract types from a DefinitelyTyped package."'
    );
});

test.skipIf(isCI)('it creates a @types package', async () => {
    const pkg = await createTypesPackageFrom('puppeteer-core', '20.7.4');

    const packageJSON = require(`${pkg}/package.json`);

    expect(packageJSON).toMatchSnapshot();
});
