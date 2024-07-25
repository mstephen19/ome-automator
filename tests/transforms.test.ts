import { describe, expect, it } from 'vitest';
import { stringSyntaxBlocks } from '../src/transforms';

describe('String Syntax Blocks', () => {
    const blocks = stringSyntaxBlocks({
        test: { transformBlock: () => '123' },
        test2: { transformBlock: () => '1234' },
    });

    describe('Validate', () => {
        it('Should pass on valid syntax', () => {
            const { ok, byToken } = blocks.validateAllBlocks('{test}testing{/test}{test2}hello{/test2}');

            expect(ok).toBe(true);
            Object.values(byToken).forEach((passed) => expect(passed).toBe(true));
        });

        it('Should not fail on invalid syntax with irrelevant tokens', () => {
            const { ok, byToken } = blocks.validateAllBlocks('{irel}testing{irel}{irel}{test3}hello{TEST}');

            expect(ok).toBe(true);
            Object.values(byToken).forEach((passed) => expect(passed).toBe(true));
        });

        it.each(['{test}{test}{test2}{/test2}', '{test}some{/test}text{test}', '{/test}123{test} testing {/test}'])(
            'Should fail on invalid syntax with relevant tokens',
            () => {
                const { ok, byToken } = blocks.validateAllBlocks('{test}{test}{test2}{/test2}');

                expect(ok).toBe(false);
                expect(byToken.test).toBe(false);
                expect(byToken.test2).toBe(true);
            }
        );
    });

    describe('Transform Blocks', () => {
        it.each([
            { input: '{TEST}hello', output: '{TEST}hello' },
            { input: '{test}hello{/test}', output: '123' },
            { input: '{test}hello{/test}{test2}hello{/test2}', output: '1231234' },
            { input: '{test}hello{/test}{test2}hello{/test2}{invalid}x{/invalid}', output: '1231234{invalid}x{/invalid}' },
        ])('Should transform blocks correctly', ({ input, output }) => {
            expect(blocks.transformAllBlocks(input)).toBe(output);
        });
    });
});
