import { MetadataExtractor } from './metadata-extractor';
import { TuneBookDescriptor, TuneBookCollection } from '../model/tunebook-collection';
import { TuneBookCollectionService } from './tunebook-collection.service';
import fs from 'fs';

function mergeMetadata(targetCollection: TuneBookCollection, book: TuneBookDescriptor) {
        const extractor = new MetadataExtractor();
        const abc = fs.readFileSync(`src/assets/${book.uri}`, 'utf8');
        const tunes = extractor.extract(abc);
        const mixin: TuneBookDescriptor = {
            id: book.id,
            description: '',
            name: '',
            storage: 'assets',
            tunes: tunes,
            uri: ''
        };
        const mixinCollection: TuneBookCollection = { books: [mixin]};
        const service = new TuneBookCollectionService(undefined, undefined, undefined);
        service.loadAndMergeCollections(targetCollection, mixinCollection);
}

describe('MetadataExtractor', () => {
    test('should get key and rhythm', () => {
        const json = fs.readFileSync('src/assets/tunebooks.json', 'utf8');
        const targetCollection = JSON.parse(json) as TuneBookCollection;
        targetCollection.books.forEach(book => mergeMetadata(targetCollection, book));

        fs.writeFileSync('merged-collection.json', JSON.stringify(targetCollection));
    });
});