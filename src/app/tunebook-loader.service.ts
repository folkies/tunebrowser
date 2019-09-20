import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TuneBook } from 'abcjs';

@Injectable()
export class TuneBookLoaderService {
    constructor(private httpClient: HttpClient) {
    }

    async loadTuneBook(): Promise<TuneBook> {
        return this.httpClient.get('assets/tunebook.abc', { responseType: 'text' })
            .toPromise()
            .then(data => new TuneBook(data.toString()));
    }
}
