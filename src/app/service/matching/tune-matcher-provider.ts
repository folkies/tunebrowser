import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NormalizedTune } from 'src/app/model/normalized-tune';
import { TuneMatcher } from './tune-matcher';

@Injectable()
export class TuneMatcherProvider {

    private instance: TuneMatcher;

    constructor(private httpClient: HttpClient) {
    }

    async tuneMatcher(): Promise<TuneMatcher> {
        if (!this.instance) {
            const indexedTunes = await this.httpClient.get<NormalizedTune[]>('assets/normalized-tunes.json')
                .toPromise()
            const matcher = new TuneMatcher(indexedTunes);
            this.instance = matcher;
        }
        return this.instance;
    }
}