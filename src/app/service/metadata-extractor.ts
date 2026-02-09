import { extractAllMetadata } from './abc-util';
import { describe, test } from 'vitest'
import { TuneBookDescriptor, TuneBookCollection } from '../model/tunebook-collection';
import { TuneBookCollectionService } from './tunebook-collection.service';
import fs from 'fs';

function mergeMetadata(targetCollection: TuneBookCollection, book: TuneBookDescriptor) {
        const abc = fs.readFileSync(`src/assets/${book.uri}`, 'utf8');
        const tunes = extractAllMetadata(abc);
        const mixin: TuneBookDescriptor = {
            id: book.id,
            description: '',
            name: '',
            storage: 'assets',
            tunes,
            uri: ''
        };
        const mixinCollection: TuneBookCollection = { books: [mixin]};
        const service = new TuneBookCollectionService();
        service.mergeCollections(targetCollection, mixinCollection);
}

/**
 * Reads all tunebooks defined in `src/assets/tunebooks.json` and extracts metadata to be included in the
 * tunebook index at runtime.
 * 
 * The extracted data are written to `src/assets/tunebook-collection.json`.
 */
describe('MetadataExtractor', () => {
    test('should get key and rhythm', () => {
        const json = fs.readFileSync('src/assets/tunebooks.json', 'utf8');
        const targetCollection = JSON.parse(json) as TuneBookCollection;
        targetCollection.books.forEach(book => mergeMetadata(targetCollection, book));

        fs.writeFileSync('src/assets/tunebook-collection.json', JSON.stringify(targetCollection));
    });
});
