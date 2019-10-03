import { TuneBook } from 'abcjs/midi';
import fs from 'fs';
import { TuneBookIndex } from './tunebook-index';

describe('TuneBookIndex', () => {
    let tunebook: TuneBook;
    let tuneBookIndex: TuneBookIndex;

    beforeAll(() => {
        const text = fs.readFileSync('src/assets/tunebook.abc', 'utf8');
        tunebook = new TuneBook(text);
        tuneBookIndex = new TuneBookIndex();
        tuneBookIndex.setTuneBook(tunebook);
    });

    test('should find by ID', () => {
        const tunes = tuneBookIndex.findTunes('273');
        expect(tunes).toBeDefined();
        expect(tunes.length).toBe(1);
        const tune = tunes[0];
        expect(tune.title).toBe('273 The Boys Of Malin');
    });

    test('should not find by non-existing ID', () => {
        const tunes = tuneBookIndex.findTunes('1234567');
        expect(tunes).toBeDefined();
        expect(tunes.length).toBe(0);
    });

    test('should find by title', () => {
        const tunes = tuneBookIndex.findTunes('Boys Of Malin');
        expect(tunes).toBeDefined();
        const tune = tunes[0];
        expect(tune.title).toBe('273 The Boys Of Malin');
        expect(tune.id).toBe('273');
    });

    test('should find by lower-case title', () => {
        const tunes = tuneBookIndex.findTunes('boys of malin');
        expect(tunes).toBeDefined();
        const tune = tunes[0];
        expect(tune.title).toBe('273 The Boys Of Malin');
        expect(tune.id).toBe('273');
    });

    test('should find by word from title', () => {
        const tunes = tuneBookIndex.findTunes('malin');
        expect(tunes).toBeDefined();
        const tune = tunes[0];
        expect(tune.title).toBe('273 The Boys Of Malin');
        expect(tune.id).toBe('273');
    });

    test('should find multiple tunes', () => {
        const tunes = tuneBookIndex.findTunes('banshee');
        expect(tunes).toBeDefined();
        expect(tunes.length).toBe(2);
        expect(tunes[0].title).toBe('30    Lilting Banshee');
        expect(tunes[0].id).toBe('30');
        expect(tunes[1].title).toBe('63    The Banshee');
        expect(tunes[1].id).toBe('63');
    });

});
