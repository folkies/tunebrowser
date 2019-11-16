import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { TuneBookReference } from 'src/app/model/tunebook-reference';
import { csvToArray } from 'src/app/service/tags';
import { IndexEntry } from '../../model/index-entry';
import { TuneQuery } from '../../model/tune-query';
import { TuneBookIndex } from '../../service/tunebook-index';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {

    query: string;
    rhythm: string;
    key: string;
    tags: string;
    tunes: IndexEntry[] = [];
    selectedBooks: string[] = [];

    searchCompleted = false;

    private indexReady = false;
    private queryParams: ParamMap;

    constructor(
        private tuneBookIndex: TuneBookIndex,
        private route: ActivatedRoute,         
        private router: Router) {
    }

    ngOnInit() {
        this.selectedBooks = [this.tuneBookIndex.defaultBook];
        this.route.queryParamMap.subscribe(map => this.consumeParameters(map));
        this.tuneBookIndex.allReady.subscribe(ready => {
            this.indexReady = ready;
            this.extractParamsAndRunQuery();
        });
    }

    private extractParamsAndRunQuery() {
        if (this.indexReady && this.queryParams.keys.length > 0) {
            this.query = this.queryParams.get('q');
            this.key = this.queryParams.get('key');
            this.rhythm = this.queryParams.get('rhythm');
            this.selectedBooks = this.queryParams.getAll('book');
            this.tags = this.queryParams.getAll('tag').join(', ');
            this.runQuery();
        }
    }

    private consumeParameters(params: ParamMap): void {
        this.queryParams = params;
        this.extractParamsAndRunQuery();
    }

    noResults(): boolean {
        return this.searchCompleted && this.tunes.length === 0;
    }

    uniqueResult(): boolean {
        return this.tunes.length === 1;
    }

    multipleResults(): boolean {
        return this.tunes.length >= 2;
    }

    currentTune(): string {
        return this.uniqueResult() ? this.tuneBookIndex.getAbc(this.tunes[0]) : '';
    }

    findTunes(): void {
        this.router.navigate(['/search'], { queryParams: {
            q: this.query,
            rhythm: this.rhythm,
            key: this.key,
            book: this.selectedBooks,
            tag: csvToArray(this.tags)
        }});
    }

    private runQuery() {
        if (this.selectedBooks === undefined || this.selectedBooks.length === 0) {
            this.selectedBooks = [this.tuneBookIndex.getBooks()[0].descriptor.id];
        }
        const rhythm = this.rhythm && this.rhythm.toLowerCase();
        const query = new TuneQuery(this.query, rhythm, this.key, this.selectedBooks, csvToArray(this.tags));
        this.tunes = this.tuneBookIndex.findTunes(query);
        this.searchCompleted = true;

        if (this.uniqueResult()) {
            this.navigateToTune(this.tunes[0]);
        }
    }

    navigateToTune(tune: IndexEntry): void {
        const bookId = tune.book;
        const tuneId = tune.id;
        this.router.navigate([`/tune/${bookId}/${tuneId}`]);
    }

    getAbc(entry: IndexEntry): string {
        return this.tuneBookIndex.getAbc(entry);
    }

    getBookName(entry: IndexEntry): string {
        return this.tuneBookIndex.getBook(entry).descriptor.name;
    }

    getRhythmAndKey(entry: IndexEntry): string {
        if (entry.rhythm === undefined && entry.key === undefined) {
            return '';
        }
        if (entry.key === undefined) {
            return entry.rhythm;
        }
        if (entry.rhythm === undefined) {
            return entry.key;
        }
        return `${entry.rhythm} in ${entry.key}`;
    }
    
    hasTags(entry: IndexEntry): boolean {
        return entry.tags && entry.tags.length > 0;
    }
 
    getTags(entry: IndexEntry): string {
        return entry.tags.join(', ');
    }
 
    books(): TuneBookReference[] {
        return this.tuneBookIndex.getBooks();
    }
}
