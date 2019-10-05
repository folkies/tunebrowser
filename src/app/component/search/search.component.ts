import { Component } from '@angular/core';
import { IndexEntry } from '../../index-entry';
import { TuneBookIndex } from '../../service/tunebook-index';
import { TuneQuery } from '../../tune-query';


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html'
})
export class SearchComponent {

    rawAbc: string;
    query: string;
    tunes: IndexEntry[] = [];
    svgMap: Map<string, string> = new Map();
    displayedColumns: string[] = ['title', 'snippet'];

    private searchCompleted = false;

    constructor(private tuneBookIndex: TuneBookIndex) {

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
        this.tunes = this.tuneBookIndex.findTunes(new TuneQuery(this.query));
        this.searchCompleted = true;
    }

    renderTune(tune: IndexEntry): boolean {
        this.tunes = [tune];
        return true;
    }
}
