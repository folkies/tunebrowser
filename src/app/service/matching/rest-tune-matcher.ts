import { HttpClient } from '@angular/common/http';
import { NormalizedTune } from '../../model/normalized-tune';
import { Injectable, inject } from '@angular/core';

@Injectable()
export class RestTuneMatcher  {
    private httpClient = inject(HttpClient);


    async findBestMatches(query: string): Promise<NormalizedTune[]> {
        return this.httpClient.get<NormalizedTune[]>('https://matt-vkhoermztq-ew.a.run.app/match/' + query).toPromise();
    }
}