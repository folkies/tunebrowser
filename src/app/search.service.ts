import { TuneBook, TuneBookEntry } from 'abcjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SearchService {
    public tunebook: TuneBook;
    private titleToIdMap: Map<string, string> = new Map();
    private normalizedTitleToIdMap: Map<string, string> = new Map();

    constructor(private httpClient: HttpClient) {
    }

    private buildIndex(): void {
        this.tunebook.tunes.forEach(tune => {
            this.titleToIdMap.set(tune.title, tune.id);
            this.normalizedTitleToIdMap.set(this.normalize(tune.title), tune.id);
        });
    }

    private normalize(title: string): string {
        return title.trim().toLocaleLowerCase();
    }

    public findTunes(query: string): TuneBookEntry[] {
        if (this.tunebook === undefined) {
            this.loadTuneBook();
        }
        const trimmed = query.trim();
        if (this.startsWithDigit(trimmed)) {
            const tune = this.tunebook.getTuneById(trimmed);
            return tune ? [tune] : [];
        }
        const tunes: TuneBookEntry[] = [];
        const normalized = this.normalize(trimmed);
        this.normalizedTitleToIdMap.forEach((id, title) => {
            if (title.includes(normalized)) {
                tunes.push(this.tunebook.getTuneById(id));
            }
        });
        return tunes;
    }

    private startsWithDigit(query: string) {
        const c = query.charAt(0);
        return '0' <= c && c <= '9';
    }

    private loadTuneBook(): void {
        if (this.httpClient !== undefined && this.tunebook === undefined) {
            this.httpClient.get('/assets/tunebook.abc', {responseType: 'text'})
                .toPromise()
                .then(data => {
                    this.tunebook = new TuneBook(data.toString());
                    this.buildIndex();
                });
        }
    }
}
