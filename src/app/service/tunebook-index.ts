import { Injectable } from '@angular/core';
import { TuneBookEntry } from 'abcjs/midi';
import { Observable, Subject } from 'rxjs';
import { IndexEntry } from '../model/index-entry';
import { TuneQuery } from '../model/tune-query';
import { TuneBookReference } from '../model/tunebook-reference';

@Injectable()
export class TuneBookIndex {
    private pathToBookMap: Map<string, TuneBookReference> = new Map();
    private entries: IndexEntry[] = [];

    private tuneBookReadySource = new Subject<string>();

    tuneBookReady: Observable<string> = this.tuneBookReadySource.asObservable();

    isReady(): boolean {
        return this.entries.length > 0;
    }

    addTuneBook(tuneBookRef: TuneBookReference) {
        this.pathToBookMap.set(tuneBookRef.descriptor.path, tuneBookRef);
        tuneBookRef.tuneBook.tunes.forEach(tune => {
            this.entries.push(this.createEntry(tune, tuneBookRef));
        });
        this.tuneBookReadySource.next(tuneBookRef.descriptor.name);
    }

    private createEntry(tune: TuneBookEntry, tuneBookRef: TuneBookReference): IndexEntry {
        return new IndexEntry(tune.id, tuneBookRef.descriptor.path, tune.title, this.normalize(tune.title));
    }

    private normalize(title: string): string {
        return title.trim().toLocaleLowerCase();
    }

    public findTunes(tuneQuery: TuneQuery): IndexEntry[] {
        const trimmed = tuneQuery.query.trim();
        const books = Array.from(this.pathToBookMap.values()).filter(book => tuneQuery.matchesRef(book));
        if (this.startsWithDigit(trimmed)) {
            const matchingEntries: IndexEntry[] = [];
            books.forEach(book => {
                const tune = book.tuneBook.getTuneById(trimmed);
                if (tune !== null) {
                    const entry = new IndexEntry(tune.id, book.descriptor.path, tune.title, this.normalize(tune.title));
                    matchingEntries.push(entry);
                }
            });
            return matchingEntries;
        } else {
            const normalized = this.normalize(trimmed);
            return this.entries.filter(entry => this.matchesEntry(tuneQuery, normalized, entry));
        }
    }

    matchesEntry(query: TuneQuery, normalized: string, indexEntry: IndexEntry): boolean {
        if (!query.matchesName(indexEntry.book)) {
            return false;
        }
        return indexEntry.titleNormalized.includes(normalized);
    }

    public getAbc(entry: IndexEntry): string {
        const tuneBookRef = this.pathToBookMap.get(entry.book);
        return tuneBookRef.tuneBook.getTuneById(entry.id).abc;
    }

    findAllTunes(bookName: string): TuneBookEntry[] {
        return this.pathToBookMap.get(bookName).tuneBook.tunes;
    }

    getBooks(): TuneBookReference[] {
        return Array.from(this.pathToBookMap.values());
    }

    getBook(entry: IndexEntry): TuneBookReference {
        return this.pathToBookMap.get(entry.book);
    }

    private startsWithDigit(query: string) {
        const c = query.charAt(0);
        return '0' <= c && c <= '9';
    }
}
