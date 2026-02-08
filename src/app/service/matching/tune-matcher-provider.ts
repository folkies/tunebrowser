import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Remote, wrap } from 'comlink';
import { ITuneMatcher } from './tune-matcher';

@Injectable()
export class TuneMatcherProvider {
    private httpClient: HttpClient = inject(HttpClient)

    private instance: Remote<ITuneMatcher>;

    async tuneMatcher(): Promise<Remote<ITuneMatcher>> {
        if (!this.instance) {
            const normalizedTunes = await this.httpClient.get('assets/normalized-tunes.json', { responseType: 'text' })
                .toPromise()
            const matcher =  new Worker(new URL('./tune-matcher.worker', import.meta.url), { name: 'matcher', type: 'module' });
            this.instance = wrap<ITuneMatcher>(matcher);
            this.instance.setCorpus(normalizedTunes);
        }
        return this.instance;
    }
}