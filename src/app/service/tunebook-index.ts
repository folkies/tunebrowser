import { Injectable } from '@angular/core';
import { TuneBookEntry } from 'abcjs/midi';
import { Observable, Subject } from 'rxjs';
import { IndexEntry } from '../model/index-entry';
import { TuneQuery } from '../model/tune-query';
import { TuneBookReference } from '../model/tunebook-reference';

@Injectable()
export class TuneBookIndex {
    private idToBookMap: Map<string, TuneBookReference> = new Map();
    private entries: IndexEntry[] = [];

    private tuneBookReadySource = new Subject<string>();

    tuneBookReady: Observable<string> = this.tuneBookReadySource.asObservable();

    readonly defaultBook = 'learner';

    isReady(): boolean {
        return this.entries.length > 0;
    }

    addTuneBook(tuneBookRef: TuneBookReference) {
        this.idToBookMap.set(tuneBookRef.descriptor.id, tuneBookRef);
        tuneBookRef.tuneBook.tunes.forEach(tune => {
            this.entries.push(this.createEntry(tune, tuneBookRef));
        });
        this.tuneBookReadySource.next(tuneBookRef.descriptor.name);
    }

    updateTuneBook(tuneBookRef: TuneBookReference) {
        this.deleteTuneBook(tuneBookRef);
        this.addTuneBook(tuneBookRef);
    }

    deleteTuneBook(tuneBookRef: TuneBookReference) {
        this.idToBookMap.delete(tuneBookRef.descriptor.id);
        this.entries = this.entries.filter(entry => entry.book !== tuneBookRef.descriptor.id);
    }

    private createEntry(tune: TuneBookEntry, tuneBookRef: TuneBookReference): IndexEntry {
        return new IndexEntry(tune.id, tuneBookRef.descriptor.id, tune.title, this.normalize(tune.title));
    }

    private normalize(title: string): string {
        return title.trim().toLocaleLowerCase();
    }

    findTunes(tuneQuery: TuneQuery): IndexEntry[] {
        const trimmed = tuneQuery.query.trim();
        if (this.startsWithDigit(trimmed)) {
            const matchingEntries: IndexEntry[] = [];
            const books = Array.from(this.idToBookMap.values()).filter(book => tuneQuery.matchesRef(book));
            books.forEach(book => {
                const tune = book.tuneBook.getTuneById(trimmed);
                if (tune !== null) {
                    const entry = new IndexEntry(tune.id, book.descriptor.id, tune.title, this.normalize(tune.title));
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

    getAbc(entry: IndexEntry): string {
        const tuneBookRef = this.idToBookMap.get(entry.book);
        return tuneBookRef.tuneBook.getTuneById(entry.id).abc;
    }

    findAllTunesInBook(bookId: string): TuneBookEntry[] {
        return this.idToBookMap.get(bookId).tuneBook.tunes;
    }

    getBooks(): TuneBookReference[] {
        return Array.from(this.idToBookMap.values());
    }

    getBook(entry: IndexEntry): TuneBookReference {
        return this.idToBookMap.get(entry.book);
    }

    getBookById(bookId: string): TuneBookReference {
        return this.idToBookMap.get(bookId);
    }

    private startsWithDigit(query: string) {
        const c = query.charAt(0);
        return '0' <= c && c <= '9';
    }
}
