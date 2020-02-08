import { HttpClient } from '@angular/common/http';
import { NormalizedTune } from '../../model/normalized-tune';
import { Injectable } from '@angular/core';

@Injectable()
export class RestTuneMatcher  {

    constructor(private httpClient: HttpClient) {        
    }

    async findBestMatches(query: string): Promise<NormalizedTune[]> {
        return this.httpClient.get<NormalizedTune[]>('https://matt-vkhoermztq-ew.a.run.app/match/' + query).toPromise();
    }
}