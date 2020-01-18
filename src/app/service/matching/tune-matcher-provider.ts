import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Remote, wrap } from 'comlink';
import { ITuneMatcher } from './tune-matcher';

@Injectable()
export class TuneMatcherProvider {

    private instance: Remote<ITuneMatcher>;

    constructor(private httpClient: HttpClient) {
    }

    async tuneMatcher(): Promise<Remote<ITuneMatcher>> {
        if (!this.instance) {
            const normalizedTunes = await this.httpClient.get('assets/normalized-tunes.json', { responseType: 'text' })
                .toPromise()
            const matcher =  new Worker('./tune-matcher.worker', { name: 'matcher', type: 'module' });
            this.instance = wrap<ITuneMatcher>(matcher);
            this.instance.setCorpus(normalizedTunes);
        }
        return this.instance;
    }
}