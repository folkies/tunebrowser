import { Component, OnInit } from '@angular/core';
import { TuneBookEntry } from 'abcjs/midi';
import { TuneBookIndex } from '../tunebook-index';
import { TuneBookLoaderService } from '../tunebook-loader.service';


@Component({
    selector: 'app-search',
    templateUrl: './search.component.html'
})
export class SearchComponent {

    rawAbc: string;
    query: string;
    tunes: TuneBookEntry[] = [];
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
        return this.uniqueResult() ? this.tunes[0].abc : '';
    }

    findTunes(): void {
        this.tunes = this.tuneBookIndex.findTunes(this.query);
        this.searchCompleted = true;
    }

    renderTune(tune: TuneBookEntry): boolean {
        this.tunes = [tune];
        return true;
    }
}
