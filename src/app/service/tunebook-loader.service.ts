import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TuneBook } from 'abcjs/midi';
import { TuneBookCollection } from "../model/tunebook-collection";
import { Loader } from './loader';

@Injectable()
export class TuneBookLoaderService implements Loader {
    constructor(private httpClient: HttpClient) {
    }

    /**
     * Loads the tunebook from the given path.
     * @param path path relative to the `assets` folder.
     * @returns parsed tunebook
     */
    async loadTuneBook(path: string): Promise<TuneBook> {
        return this.httpClient.get(`assets/${path}`, { responseType: 'text' })
            .toPromise()
            .then(data => new TuneBook(data.toString()));
    }

    /**
     * Loads the tunebook collection manifest with metadata for all tunebooks.
     * @returns tunebook collection manifest
     */
    async loadTuneBookCollection(): Promise<TuneBookCollection> {
        return this.httpClient.get<TuneBookCollection>('assets/tunebook-collection.json')
            .toPromise()
    }
}
