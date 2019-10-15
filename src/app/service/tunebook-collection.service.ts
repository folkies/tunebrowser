import { Injectable, OnInit } from '@angular/core';
import { TuneBookCollection } from '../model/tunebook-collection';
import { GoogleDriveTunebookLoaderService } from './google-drive-tunebook-loader.service';
import { Loader } from './loader';
import { TuneBookLoaderService } from './tunebook-loader.service';
import { TuneBookReference } from '../model/tunebook-reference';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class TuneBookCollectionService  {
    private loaders: Loader[];
    private collection: TuneBookCollection = { books: [] };

    private collectionLoadedSource = new Subject<string>();
    collectionLoaded: Observable<string>;

    constructor(private websiteLoader: TuneBookLoaderService, private driveLoader: GoogleDriveTunebookLoaderService) {
        this.loaders = [this.websiteLoader, this.driveLoader];
        this.collectionLoaded = this.collectionLoadedSource.asObservable();
    }

    loadCollections() {
        this.loaders.forEach(loader => this.loadCollection(loader));
    }

    getBooks(): TuneBookReference[] {
        return this.collection.books.map(book => new TuneBookReference(null, book));
    }

    private loadCollection(loader: Loader) {
        loader.loadTuneBookCollection().then(c => this.addBooks(c));
    }

    private addBooks(loadedCollection: TuneBookCollection) {
        this.collection.books.push(...loadedCollection.books);
        this.collectionLoadedSource.next('');
    }
}