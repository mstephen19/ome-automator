import { describe, it, expect, vi } from 'vitest';
import { observerMock } from '../_setup';
import { Status, status, tipStatusMap } from '../../src/content/status';

const mockStatusChange = (attribute: 'rules_agreement_default' | 'connection' | 'searching') => {
    observerMock.dispatch([
        {
            type: 'attributes',
            target: {
                dataset: {
                    tr: attribute,
                },
            } as unknown as Node,
        } as MutationRecord,
    ]);
};

describe('Status', () => {
    it.each(['rules_agreement_default', 'searching', 'connection'] as const)(
        'Should reflect changes on the tip element as statuses.',
        (attribute) => {
            mockStatusChange(attribute);
            expect(status.latest).toBe(tipStatusMap[attribute]);
        }
    );

    it.each(['rules_agreement_default', 'searching', 'connection'] as const)(
        'Should emit realtime events corresponding to status changes',
        (attribute) => {
            const listener = vi.fn((_: CustomEvent<Status>) => {});
            status.events.addEventListener('change', listener);

            mockStatusChange(attribute);
            expect(listener).toHaveBeenCalledOnce();
            expect(listener).toHaveBeenCalledWith(
                expect.objectContaining({
                    detail: tipStatusMap[attribute],
                })
            );
            status.events.removeEventListener('change', listener);
        }
    );
});
