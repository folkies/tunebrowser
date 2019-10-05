import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TuneBook } from 'abcjs/midi';
import { TuneBookCollection } from "./tunebook-collection"

@Injectable()
export class TuneBookLoaderService {
    constructor(private httpClient: HttpClient) {
    }

    async loadTuneBook(path: string): Promise<TuneBook> {
        return this.httpClient.get(`assets/${path}`, { responseType: 'text' })
            .toPromise()
            .then(data => new TuneBook(data.toString()));
    }

    async loadTuneBookCollection(): Promise<TuneBookCollection> {
        return this.httpClient.get<TuneBookCollection>('assets/tunebook-collection.json')
            .toPromise()        
    }
}
