import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TuneBook } from 'abcjs/midi';
import { TuneBookCollection, TuneBookDescriptor } from "../model/tunebook-collection";
import { Loader } from './loader';
import { TuneBookReference } from '../model/tunebook-reference';

@Injectable()
export class TuneBookLoaderService implements Loader {
    constructor(private httpClient: HttpClient) {
    }

    /**
     * Loads the tunebook from the given path.
     * @param descriptor tune book descriptor. path path relative to the `assets` folder.
     * @returns tune book reference
     */
    async loadTuneBook(descriptor: TuneBookDescriptor): Promise<TuneBookReference> {
        const abc = await this.httpClient.get(`assets/${descriptor.uri}`, { responseType: 'text' }).toPromise();
        const tuneBook = new TuneBook(abc);
        return new TuneBookReference(tuneBook, descriptor, abc);
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
