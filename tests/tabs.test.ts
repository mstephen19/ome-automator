import { describe, expect, it } from 'vitest';
import { urlIsRelevant } from '../src/tabs';

describe('URL Is Relevant', () => {
    it.each(['https://ome.tv', 'https://ome.tv/', 'https://ome.tv?param=123'])('Should detect relevant URLs', (url) => {
        expect(urlIsRelevant(url)).toBe(true);
    });

    it.each(['https://ometv.com', 'https://ome.tz/', 'http://ome.tv'])('Should detect irrelevant URLs', (url) => {
        expect(urlIsRelevant(url)).toBe(false);
    });
});
