import { TuneBook, TuneBookEntry } from 'abcjs/midi';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class TuneBookIndex {
    private titleToIdMap: Map<string, string> = new Map();
    private normalizedTitleToIdMap: Map<string, string> = new Map();
    private tunebook: TuneBook;

    private tuneBookReadySource = new Subject<string>();

    tuneBookReady: Observable<string> = this.tuneBookReadySource.asObservable();

    setTuneBook(tunebook: TuneBook) {
        this.tunebook = tunebook;
        this.buildIndex();
    }

    isReady(): boolean {
        return this.tunebook !== undefined;
    }

    private buildIndex(): void {
        this.tunebook.tunes.forEach(tune => {
            this.titleToIdMap.set(tune.title, tune.id);
            this.normalizedTitleToIdMap.set(this.normalize(tune.title), tune.id);
        });
        this.tuneBookReadySource.next('tunebook.abc');
    }

    private normalize(title: string): string {
        return title.trim().toLocaleLowerCase();
    }

    public findTunes(query: string): TuneBookEntry[] {
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

    findAllTunes(): TuneBookEntry[] {
        return this.tunebook.tunes;
    }

    private startsWithDigit(query: string) {
        const c = query.charAt(0);
        return '0' <= c && c <= '9';
    }
}
