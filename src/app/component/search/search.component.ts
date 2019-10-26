import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TuneBookReference } from 'src/app/model/tunebook-reference';
import { csvToArray } from 'src/app/service/tags';
import { IndexEntry } from '../../model/index-entry';
import { TuneQuery } from '../../model/tune-query';
import { TuneBookIndex } from '../../service/tunebook-index';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, AfterViewInit {

    rawAbc: string;
    query: string;
    tags: string;
    tunes: IndexEntry[] = [];
    svgMap: Map<string, string> = new Map();
    displayedColumns: string[] = ['title', 'snippet'];
    selectedBooks: string[] = [];

    private searchCompleted = false;

    constructor(private tuneBookIndex: TuneBookIndex, private router: Router) {

    }

    ngOnInit() {
        this.selectedBooks = [this.tuneBookIndex.defaultBook];
    }

    ngAfterViewInit() {
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
        if (this.selectedBooks === undefined || this.selectedBooks.length === 0) {
            this.selectedBooks = [this.tuneBookIndex.getBooks()[0].descriptor.id];
        }
        const query = new TuneQuery(this.query, this.selectedBooks, csvToArray(this.tags));
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

    books(): TuneBookReference[] {
        return this.tuneBookIndex.getBooks();
    }
}
