import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TuneBookCollection, TuneBookDescriptor } from '../model/tunebook-collection';
import { TuneBookReference } from '../model/tunebook-reference';
import { GoogleDriveTunebookLoaderService } from './google-drive-tunebook-loader.service';
import { Loader } from './loader';
import { TuneBookIndex } from './tunebook-index';
import { TuneBookLoaderService } from './tunebook-loader.service';

@Injectable()
export class TuneBookCollectionService  {
    private loaders: Loader[];
    private collection: TuneBookCollection = { books: [] };

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

    private loadCollection(loader: Loader) {
        loader.loadTuneBookCollection().then(c => this.addBooks(c));
    }

    private addBooks(loadedCollection: TuneBookCollection) {
        this.collection.books.push(...loadedCollection.books);
        this.collectionLoadedSource.next('');
        loadedCollection.books.forEach(book => this.loadBook(book));
    }

    private async loadBook(descriptor: TuneBookDescriptor): Promise<TuneBookReference> {
        const loader = this.selectLoader(descriptor);
        const ref = await loader.loadTuneBook(descriptor);
        this.index.addTuneBook(ref);
        return ref;
    }

    private selectLoader(book: TuneBookDescriptor): Loader {
        return (book.storage === 'googledrive') ? this.driveLoader : this.websiteLoader;
    }
}