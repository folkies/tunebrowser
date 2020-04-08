import { Injectable } from '@angular/core';
import { TuneBook } from 'abcjs/midi';
import { Observable, Subject } from 'rxjs';
import { TuneBookCollection, TuneBookDescriptor, TuneDescriptor } from '../model/tunebook-collection';
import { TuneBookReference } from '../model/tunebook-reference';
import { GoogleDriveTunebookLoaderService } from './google-drive-tunebook-loader.service';
import { Loader } from './loader';
import { TuneBookIndex } from './tunebook-index';
import { TuneBookLoaderService } from './tunebook-loader.service';

@Injectable()
export class TuneBookCollectionService {
    private loaders: Loader[];
    private collection: TuneBookCollection = { books: [] };
    private loadedBookIds: string[] = [];

    private collectionLoadedSource = new Subject<string>();
    collectionLoaded: Observable<string>;

    constructor(
        private websiteLoader: TuneBookLoaderService,
        private driveLoader: GoogleDriveTunebookLoaderService,
        private index: TuneBookIndex) {
        this.loaders = [this.websiteLoader, this.driveLoader];
        this.collectionLoaded = this.collectionLoadedSource.asObservable();
    }

    loadCollections() {
        this.collection.books = [];
        this.loaders.forEach(loader => this.loadCollection(loader));
    }

    getBooks(): TuneBookReference[] {
        return this.collection.books.map(book => new TuneBookReference(null, book, ''));
    }

    async addBook(descriptor: TuneBookDescriptor): Promise<string> {
        this.collection.books.push(descriptor);
        const driveBooks = this.collection.books.filter(book => book.storage === 'googledrive');
        const ref = new TuneBookReference(new TuneBook(''), descriptor, '');
        this.index.addTuneBook(ref);

        const updated = await this.driveLoader.updateTuneBookCollection({ books: driveBooks });
        this.collectionLoadedSource.next('');
        return updated;
    }

    async setTagsForTune(tuneId: string, tuneBookId: string, tags: string[]): Promise<string> {
        const book = this.collection.books.find(book => book.id === tuneBookId);
        if (book.tunes === undefined) {
            book.tunes = [];
        }
        let tune = book.tunes.find(tune => tune.id === tuneId);
        if (tune === undefined) {
            book.tunes.push({ id: tuneId, tags });
        } else {
            tune.tags = tags;
        }
        this.index.setTagsForTune(tuneId, tuneBookId, tags);
        const updated = await this.driveLoader.updateTuneBookCollection(this.collection);
        this.collectionLoadedSource.next('');
        return updated;
    }

    private async loadCollection(loader: Loader) {
        const c = await loader.loadTuneBookCollection();
        this.loadAndMergeCollections(this.collection, c);
        this.collectionLoadedSource.next('');
    }

    loadAndMergeCollections(target: TuneBookCollection, mixin: TuneBookCollection): void {
        mixin.books.forEach(mixinBook => { 
            const mergedBook = this.mergeBooks(target.books, mixinBook);
            this.loadBook(mergedBook);
        });
    }

    mergeCollections(target: TuneBookCollection, mixin: TuneBookCollection): void {
        mixin.books.forEach(mixinBook => this.mergeBooks(target.books, mixinBook));
    }

    private mergeBooks(targetBooks: TuneBookDescriptor[], mixinBook: TuneBookDescriptor): TuneBookDescriptor {
        let targetBook = targetBooks.find(book => book.id === mixinBook.id);
        if (targetBook === undefined) {
            targetBooks.push(mixinBook);
            return mixinBook;
        } else if (mixinBook.tunes) {
            if (targetBook.tunes === undefined) {
                targetBook.tunes = mixinBook.tunes;
            } else {
                this.mergeTunes(targetBook.tunes, mixinBook.tunes);
            }
        }
        return targetBook;
    }

    private mergeTunes(targetTunes: TuneDescriptor[], mixinTunes: TuneDescriptor[]) {
        mixinTunes.forEach(mixinTune => {
            const targetTune = targetTunes.find(tune => tune.id === mixinTune.id);
            if (targetTune === undefined) {
                targetTunes.push(mixinTune);
            } else {
                this.mergeTune(targetTune, mixinTune);
            }
        });
    }

    private mergeTune(targetTune: TuneDescriptor, mixinTune: TuneDescriptor) {
        if (targetTune.displayId === undefined) {
            targetTune.displayId = mixinTune.displayId;
        }

        if (targetTune.key === undefined) {
            targetTune.key = mixinTune.key;
        }

        if (targetTune.rhythm === undefined) {
            targetTune.rhythm = mixinTune.rhythm;
        }

        if (targetTune.tags === undefined) {
            targetTune.tags = mixinTune.tags;
        } else if (mixinTune.tags) {
            const tags = new Set(targetTune.tags);
            mixinTune.tags.forEach(tag => tags.add(tag));
            targetTune.tags = Array.from(tags.keys());
        }
    }

    private addTagsToIndex(): void {
        for (let book of this.collection.books) {
            if (!book.tunes) {
                continue;
            }
            for (let tune of book.tunes) {
                if (tune.tags) {
                    this.index.setTagsForTune(tune.id, book.id, tune.tags);
                }
            }
        }
        this.index.fireAllReady();
    }

    private async loadBook(descriptor: TuneBookDescriptor): Promise<TuneBookReference> {
        if (this.loadedBookIds.indexOf(descriptor.id) >= 0) {
            return;
        }
        const loader = this.selectLoader(descriptor);
        const ref = await loader.loadTuneBook(descriptor);
        this.loadedBookIds.push(descriptor.id);
        this.index.addTuneBook(ref);
        if (this.loadedBookIds.length === this.collection.books.length) {
            this.addTagsToIndex();
        }
        return ref;
    }

    private selectLoader(book: TuneBookDescriptor): Loader {
        return (book.storage === 'googledrive') ? this.driveLoader : this.websiteLoader;
    }
}