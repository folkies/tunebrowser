import { getLogger, Logger } from '@log4js2/core';
import { Injectable } from '@angular/core';
import { AnalyzedTune } from 'abcjs';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { IndexEntry } from '../model/index-entry';
import { TuneQuery } from '../model/tune-query';
import { TuneBookDescriptor, TuneDescriptor } from '../model/tunebook-collection';
import { TuneBookReference } from '../model/tunebook-reference';
import { TuneReference } from '../model/repertoire';

@Injectable()
export class TuneBookIndex {
    private logger: Logger = getLogger('TuneBookIndex');

    private idToBookMap: Map<string, TuneBookReference> = new Map();
    private entries: IndexEntry[] = [];

    private tuneBookReadySource = new Subject<string>();
    private allReadySource = new BehaviorSubject<boolean>(false);

    tuneBookReady: Observable<string> = this.tuneBookReadySource.asObservable();
    allReady: Observable<boolean> = this.allReadySource.asObservable();

    readonly defaultBook = 'learner';

    isReady(): boolean {
        return this.entries.length > 0;
    }

    fireAllReady(): void {
        this.allReadySource.next(true);
    }

    addTuneBook(tuneBookRef: TuneBookReference) {
        this.idToBookMap.set(tuneBookRef.descriptor.id, tuneBookRef);
        tuneBookRef.tuneBook.tunes.forEach((tune, pos) => {
            this.entries.push(this.createEntry(tune, pos, tuneBookRef));
        });
        this.tuneBookReadySource.next(tuneBookRef.descriptor.id);
    }

    updateTuneBook(tuneBookRef: TuneBookReference) {
        this.deleteTuneBook(tuneBookRef);
        this.addTuneBook(tuneBookRef);
    }

    deleteTuneBook(tuneBookRef: TuneBookReference) {
        this.idToBookMap.delete(tuneBookRef.descriptor.id);
        this.entries = this.entries.filter(entry => entry.book !== tuneBookRef.descriptor.id);
    }

    private createEntry(tune: AnalyzedTune, pos: number, tuneBookRef: TuneBookReference): IndexEntry {
        const tuneDescriptor = this.findTuneDescriptor(tune.id, tuneBookRef.descriptor);
        const tags = tuneDescriptor && tuneDescriptor.tags;
        const rhythm = tuneDescriptor && tuneDescriptor.rhythm;
        const key = tuneDescriptor && tuneDescriptor.key;
        return new IndexEntry(tune.id,
            pos,
            tuneBookRef.descriptor.id,
            tune.title,
            this.normalize(tune.title),
            rhythm,
            key,
            tags);
    }

    private findTuneDescriptor(tuneId: string, tuneBookDescriptor: TuneBookDescriptor): TuneDescriptor {
        if (tuneBookDescriptor.tunes === undefined) {
            return undefined;
        }

        return tuneBookDescriptor.tunes.find(tune => tune.id === tuneId);
    }

    private normalize(title: string): string {
        return title && title.trim().toLocaleLowerCase();
    }

    findTunes(tuneQuery: TuneQuery): IndexEntry[] {
        const trimmed = tuneQuery.title && tuneQuery.title.trim();
        if (this.startsWithDigit(trimmed)) {
            const books = Array.from(this.idToBookMap.values()).filter(book => tuneQuery.matchesRef(book));
            return books.map(book => this.findEntryById(book, trimmed)).filter(entry => entry !== undefined);
        } else {
            const normalized = this.normalize(trimmed);
            return this.entries.filter(entry => this.matchesEntry(tuneQuery, normalized, entry));
        }
    }

    findEntryById(book: TuneBookReference, id: string): IndexEntry {
        return this.entries.find(entry => entry.book === book.descriptor.id && entry.id === id);
    }

    findEntryByTuneReference(ref: TuneReference): IndexEntry {
        return this.entries.find(entry => entry.book === ref.bookId && entry.id === ref.tuneId);
    }

    setTagsForTune(tuneId: string, tuneBookId: string, tags: string[]): void {
        const bookRef = this.getBookById(tuneBookId);
        const entry = this.findEntryById(bookRef, tuneId);
        if (!bookRef || !entry) {
            this.logger.error(`Index entry not found for ${tuneBookId}/${tuneId}`);
            return;
        }
        entry.tags = tags;
    }

    matchesEntry(query: TuneQuery, titleNormalized: string, indexEntry: IndexEntry): boolean {
        if (!query.matchesName(indexEntry.book)) {
            return false;
        }

        if (query.rhythm && indexEntry.rhythm !== query.rhythm) {
            return false;
        }

        if (query.key && indexEntry.key !== query.key) {
            return false;
        }

        if (query.tags && !query.tags.find(tag => indexEntry.hasTag(tag))) {
            return false;
        }

        return !query.title || indexEntry.titleNormalized.includes(titleNormalized);
    }

    getAbc(entry: IndexEntry): string {
        const tuneBookRef = this.idToBookMap.get(entry.book);
        return tuneBookRef.tuneBook.getTuneById(entry.id).abc;
    }

    findAllTunesInBook(bookId: string): AnalyzedTune[] {
        return this.idToBookMap.get(bookId)?.tuneBook.tunes;
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
        if (!query) {
            return false;
        }
        const c = query.charAt(0);
        return '0' <= c && c <= '9';
    }
}
