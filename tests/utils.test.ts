import { describe, expect, it } from 'vitest';
import { pollPredicate, raceWithEvent, TypedEventTarget, wait } from '../src/utils';

const testEvents = new TypedEventTarget<{
    test: CustomEvent;
}>();

describe('Race With Event', () => {
    class TestError extends Error {}
    const raceWithTestError = raceWithEvent(TestError)(testEvents, 'test');

    it('Should succeed normally if the event never comes through.', () => {
        expect(
            raceWithTestError(
                async () => {
                    await wait(250);
                    return 123;
                },
                () => true
            )()
        ).resolves.toBe(123);
    });

    it('Should succeed normally if the predicate never passes.', () => {
        expect(
            raceWithTestError(
                async () => {
                    await wait(250);
                    return 123;
                },
                () => false
            )()
        ).resolves.toBe(123);
    });

    it('Should throw with the custom error type if the event comes through & predicate passes.', () => {
        const promise = raceWithTestError(
            async () => {
                await wait(250);
                return 123;
            },
            () => true
        )();

        testEvents.dispatchEvent(new CustomEvent('test'));

        expect(promise).rejects.toBeInstanceOf(TestError);
    });

    it("Should not throw if the event comes through but predicate doesn't pass.", () => {
        const promise = raceWithTestError(
            async () => {
                await wait(250);
                return 123;
            },
            () => false
        )();

        testEvents.dispatchEvent(new CustomEvent('test'));

        expect(promise).resolves.toBe(123);
    });
});

describe('Poll Predicate', () => {
    it('Should wait until the predicate returns true', () => {
        let a = 0;
        setTimeout(() => (a = 1), 500);
        expect(pollPredicate(100, () => Boolean(a))).resolves.toBeUndefined();
    });
});
