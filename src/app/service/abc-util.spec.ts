import { describe, expect, test } from 'vitest';
import { extractMetadata, extractSnippet, normalizeKey, purgeHeaders, titleWithoutNumber } from './abc-util';
import { TuneBook } from 'abcjs';

const tolka = `X: 20a
T: The Tolka
R: polka
M: 2/4
L: 1/8
K: Ador
F: http://example.com/tunes/20a
|:A>B cg|de cA|B/c/B/A/ Gd|AB GE|
A>B cg|de cA|B/c/B/A/ Gd|BA A2:|
|:d>e fa|ga fd|g/e/d/c/ Bd/c/|B/A/G B/A/G/B/|
A>B cg|de cA|B/c/B/A/ Gd|BA A2:|
|:e>f2/g2/ f|d e>f2/g2/ |fd f/g/f/e/| dc B(d|
d) c/B/ cg|de cA|B/c/B/A/ Gd|BA A2:|
`;

const result = `T: The Tolka
M: 2/4
L: 1/8
K: Ador
|:A>B cg|de cA|B/c/B/A/ Gd|AB GE|
A>B cg|de cA|B/c/B/A/ Gd|BA A2:|
|:d>e fa|ga fd|g/e/d/c/ Bd/c/|B/A/G B/A/G/B/|
A>B cg|de cA|B/c/B/A/ Gd|BA A2:|
|:e>f2/g2/ f|d e>f2/g2/ |fd f/g/f/e/| dc B(d|
d) c/B/ cg|de cA|B/c/B/A/ Gd|BA A2:|`;

const snippet = `X: 20a
M: 2/4
L: 1/8
K: Ador
|:A>B cg|de cA`;

describe('abc-util', () => {

    test('should purge headers', () => {
        const purged = purgeHeaders(tolka);

        expect(purged).not.toContain('X:');
        expect(purged).not.toContain('R:');
        expect(purged).not.toContain('F:');
        expect(purged).toBe(result);
    });

    test('should remove number from title', () => {
        expect(titleWithoutNumber('123 The Tolka')).toBe('The Tolka');
        expect(titleWithoutNumber('123a The Tolka')).toBe('The Tolka');
        expect(titleWithoutNumber('Tolka, The')).toBe('The Tolka');
        expect(titleWithoutNumber('123 Tolka, The')).toBe('The Tolka');
    });

    test('should extract snippet', () => {
        expect(extractSnippet(tolka)).toBe(snippet);
    });

    test('should extract metadata', () => {
        const tune = new TuneBook(tolka).tunes[0];
        expect(extractMetadata(tune)).toEqual({
            id: '20a',
            rhythm: 'polka',
            key: 'Ador'
        });
    });

    test('should normalize key', () => {
        expect(normalizeKey('G', 'maj')).toBe('G');
        expect(normalizeKey('A', 'min')).toBe('Am');
        expect(normalizeKey('D', 'dor')).toBe('Ddor');
    });

});
