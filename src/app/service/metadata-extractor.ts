import fs from 'fs';
import { TuneBookCollection, TuneBookDescriptor, mergeCollections } from '../model/tunebook-collection';
import { extractAllMetadata } from './abc-util';

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
        mergeCollections(targetCollection, mixinCollection);
}

/**
 * Reads all tunebooks defined in `src/assets/tunebooks.json` and extracts metadata to be included in the
 * tunebook index at runtime.
 * 
 * The extracted data are written to `src/assets/tunebook-collection.json`.
 */
function extractMetadata(): void {
    const json = fs.readFileSync('src/assets/tunebooks.json', 'utf8');
    const targetCollection = JSON.parse(json) as TuneBookCollection;
    targetCollection.books.forEach(book => mergeMetadata(targetCollection, book));

    fs.writeFileSync('src/assets/tunebook-collection.json', JSON.stringify(targetCollection));
}

extractMetadata();