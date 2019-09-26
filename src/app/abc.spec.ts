import fs from 'fs';
import { numberOfTunes, TuneBook, parseOnly, signature } from 'abcjs/midi';

describe('ABCJS', () => {
    const abcTunebook = `X: 20a
T: The Tolka
R: polka
M: 2/4
L: 1/8
K: Ador
|:A>B cg|de cA|B/c/B/A/ Gd|AB GE|
A>B cg|de cA|B/c/B/A/ Gd|BA A2:|
|:d>e fa|ga fd|g/e/d/c/ Bd/c/|B/A/G B/A/G/B/|
A>B cg|de cA|B/c/B/A/ Gd|BA A2:|
|:e>f2/g2/ f|d e>f2/g2/ |fd f/g/f/e/| dc B(d|
d) c/B/ cg|de cA|B/c/B/A/ Gd|BA A2:|

X: 10b
T: Condon's Frolics
R: jig
M: 6/8
L: 1/8
K: Ador
|eAB c2d|edc BAG|eAB c2d|e2d eag|
eAB c2d|edc ~B3|GBd gdB|1~A3 ABd:|2~A3 A2d||
|:eaa efg|dec BAG|cBc dcd|e2d efg|
eaa efg|dec BAB|GBd gdB|1~A3 A2d:|2~A3 ABd|
`;

    test('should get number of tunes', () => {
        expect(numberOfTunes(abcTunebook)).toBe(2);
    });

    test('should get tune by title', () => {
        const tunebook = new TuneBook(abcTunebook);
        const tolka = tunebook.getTuneByTitle('The Tolka');

        expect(tolka.id).toBe('20a');
        expect(tolka.title).toBe('The Tolka');

        const condon = tunebook.getTuneByTitle('Condon\'s Frolics');
        expect(condon.id).toBe('10b');
        expect(condon.title).toBe('Condon\'s Frolics');
    });

    test('should get tune by ID', () => {
        const tunebook = new TuneBook(abcTunebook);
        const tolka = tunebook.getTuneById('20a');

        expect(tolka.id).toBe('20a');
        expect(tolka.title).toBe('The Tolka');

        const condon = tunebook.getTuneById('10b');
        expect(condon.id).toBe('10b');
        expect(condon.title).toBe('Condon\'s Frolics');
    });

    test('should parse', () => {
        const tunes = parseOnly(abcTunebook);
        expect(tunes.length).toBe(2);
        const tune = tunes[0];

        const values = {
            barLength: tune.getBarLength(),
            beatLength: tune.getBeatLength(),
            beatsPerMeasure: tune.getBeatsPerMeasure(),
            bpm: tune.getBpm(),
            meter: tune.getMeter(),
            meterFraction: tune.getMeterFraction(),
            pickupLength: tune.getPickupLength(),
        };

        expect(tune.media).toBe('screen');
        expect(tune.getBarLength()).toBe(0.5);
        expect(tune.getBeatLength()).toBe(0.25);
        expect(tune.getBeatsPerMeasure()).toBe(2);
        expect(tune.getBpm()).toBe(180);
        expect(tune.getMeter()).toEqual({ type: 'specified', value: [{ num: '2', den: '4' }] });
        expect(tune.getMeterFraction()).toEqual({ num: 2, den: 4 });
        expect(tune.version).toBe('1.0.1');
    });

    test('should get signature', () => {
        expect(signature).toBe('abcjs-basic v5.8.1');
    });

    test('should read large tunebook', () => {
        const text = fs.readFileSync('src/assets/tunebook.abc', 'utf8');
        const tunebook = new TuneBook(text);
        const fanny = tunebook.getTuneByTitle('Fanny Power');
        expect(fanny).toBeDefined();
        expect(fanny.id).toBe('281');
    });
});
