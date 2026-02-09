import { TuneBook } from 'abcjs';
import fs from 'fs';
import { beforeAll, describe, expect, test } from 'vitest';

import { tagQuery, titleQuery } from '../model/tune-query';
import { TuneBookDescriptor } from '../model/tunebook-collection';
import { TuneBookReference } from '../model/tunebook-reference';
import { TuneBookIndex } from './tunebook-index';

describe('TuneBookIndex', () => {
    let tunebook: TuneBook;
    let tuneBookIndex: TuneBookIndex;
    let tuneBookDescriptor: TuneBookDescriptor;
    let tuneBookRef: TuneBookReference;

    beforeAll(() => {
        const text = fs.readFileSync('src/assets/LearnerSession.abc', 'utf8');
        tunebook = new TuneBook(text);
        tuneBookDescriptor = {
            id: 'learner',
            name: 'Test Tunes',
            description: 'Test Tunes',
            storage: 'assets',
            uri: 'LearnerSession.abc',
            tunes: [
                {
                    id: '32',
                    tags: ['gold']
                }, 
                {
                    id: '40',
                    tags: ['gold', 'silver']
                }, 
            ]
        }
        tuneBookRef = new TuneBookReference(tunebook, tuneBookDescriptor, text);
        tuneBookIndex = new TuneBookIndex();
        tuneBookIndex.addTuneBook(tuneBookRef);
    });

    test('should find by ID', () => {
        const tunes = tuneBookIndex.findTunes(titleQuery('273'));
        expect(tunes).toBeDefined();
        expect(tunes.length).toBe(1);
        const tune = tunes[0];
        expect(tune.title).toBe('The Boys Of Malin');
    });

    test('should not find by non-existing ID', () => {
        const tunes = tuneBookIndex.findTunes(titleQuery('1234567'));
        expect(tunes).toBeDefined();
        expect(tunes.length).toBe(0);
    });

    test('should find by title', () => {
        const tunes = tuneBookIndex.findTunes(titleQuery('Boys Of Malin'));
        expect(tunes).toBeDefined();
        const tune = tunes[0];
        expect(tune.title).toBe('The Boys Of Malin');
        expect(tune.id).toBe('273');
    });

    test('should find by lower-case title', () => {
        const tunes = tuneBookIndex.findTunes(titleQuery('boys of malin'));
        expect(tunes).toBeDefined();
        const tune = tunes[0];
        expect(tune.title).toBe('The Boys Of Malin');
        expect(tune.id).toBe('273');
    });

    test('should find by word from title', () => {
        const tunes = tuneBookIndex.findTunes(titleQuery('malin'));
        expect(tunes).toBeDefined();
        const tune = tunes[0];
        expect(tune.title).toBe('The Boys Of Malin');
        expect(tune.id).toBe('273');
    });

    test('should find multiple tunes', () => {
        const tunes = tuneBookIndex.findTunes(titleQuery('banshee'));
        expect(tunes).toBeDefined();
        expect(tunes.length).toBe(2);
        expect(tunes[0].title).toBe('Lilting Banshee');
        expect(tunes[0].id).toBe('30');
        expect(tunes[1].title).toBe('The Banshee');
        expect(tunes[1].id).toBe('63');
    });

    test('should find by tag', () => {
        const tunes = tuneBookIndex.findTunes(tagQuery('silver'));
        expect(tunes).toBeDefined();
        expect(tunes.length).toBe(1);
        expect(tunes[0].title).toBe('Miss Monaghan');
        expect(tunes[0].id).toBe('40');
    });

    test('should find multiple tunes by tag', () => {
        const tunes = tuneBookIndex.findTunes(tagQuery('gold'));
        expect(tunes).toBeDefined();
        expect(tunes.length).toBe(2);
        expect(tunes[0].title).toBe('Chief O\'Neill\'s');
        expect(tunes[0].id).toBe('32');
        expect(tunes[1].title).toBe('Miss Monaghan');
        expect(tunes[1].id).toBe('40');
    });

});
