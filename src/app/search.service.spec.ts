import { TuneBook } from 'abcjs';
import fs from 'fs';
import { SearchService } from './search.service';

describe('SearchService', () => {
    let tunebook: TuneBook;
    let searchService: SearchService;

    beforeAll(() => {
        const text = fs.readFileSync('src/assets/tunebook.abc', 'utf8');
        tunebook = new TuneBook(text);
        searchService = new SearchService(undefined);
        searchService.tunebook = tunebook;
    });

    test('should find by ID', () => {
        const tunes = searchService.findTunes('273');
        expect(tunes).toBeDefined();
        expect(tunes.length).toBe(1);
        const tune = tunes[0];
        expect(tune.title).toBe('Boys Of Malin');
    });

    test('should not find by non-existing ID', () => {
        const tunes = searchService.findTunes('1234567');
        expect(tunes).toBeDefined();
        expect(tunes.length).toBe(0);
    });

    test('should find by title', () => {
        const tunes = searchService.findTunes('Boys Of Malin');
        expect(tunes).toBeDefined();
        const tune = tunes[0];
        expect(tune.title).toBe('Boys Of Malin');
        expect(tune.id).toBe('273');
    });

    test('should find by lower-case title', () => {
        const tunes = searchService.findTunes('boys of malin');
        expect(tunes).toBeDefined();
        const tune = tunes[0];
        expect(tune.title).toBe('Boys Of Malin');
        expect(tune.id).toBe('273');
    });

    test('should find by word from title', () => {
        const tunes = searchService.findTunes('malin');
        expect(tunes).toBeDefined();
        const tune = tunes[0];
        expect(tune.title).toBe('Boys Of Malin');
        expect(tune.id).toBe('273');
    });

    test('should find multiple tunes', () => {
        const tunes = searchService.findTunes('banshee');
        expect(tunes).toBeDefined();
        expect(tunes.length).toBe(2);
        expect(tunes[0].title).toBe('Lilting Banshee');
        expect(tunes[0].id).toBe('30');
        expect(tunes[1].title).toBe('Banshee, The');
        expect(tunes[1].id).toBe('63');
    });

});
