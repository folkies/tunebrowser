import { Component, OnInit, AfterViewInit } from '@angular/core';
import { IndexEntry } from '../../model/index-entry';
import { TuneBookIndex } from '../../service/tunebook-index';
import { TuneQuery } from '../../model/tune-query';
import { TuneBookReference } from 'src/app/model/tunebook-reference';


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, AfterViewInit {

    rawAbc: string;
    query: string;
    tunes: IndexEntry[] = [];
    svgMap: Map<string, string> = new Map();
    displayedColumns: string[] = ['title', 'snippet'];
    selectedBooks: string[] = [];

    private searchCompleted = false;

    constructor(private tuneBookIndex: TuneBookIndex) {

    }

    ngOnInit() {
        this.selectedBooks = [this.tuneBookIndex.getBooks()[0].descriptor.id];
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
        const query = new TuneQuery(this.query, this.selectedBooks);
        this.tunes = this.tuneBookIndex.findTunes(query);
        this.searchCompleted = true;
    }

    renderTune(tune: IndexEntry): boolean {
        this.tunes = [tune];
        return true;
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
