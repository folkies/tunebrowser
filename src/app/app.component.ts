import { Component, OnInit } from '@angular/core';
import { TuneBookEntry } from 'abcjs';
import { TuneBookIndex } from './tunebook-index';
import { TuneBookLoaderService } from './tunebook-loader.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'folkies';
    rawAbc: string;
    query: string;
    tunes: TuneBookEntry[] = [];
    svgMap: Map<string, string> = new Map();

    private tuneBookIndex: TuneBookIndex;

    constructor(private tuneBookLoaderService: TuneBookLoaderService) {

    }

    async ngOnInit(): Promise<void> {
        const tuneBook = await this.tuneBookLoaderService.loadTuneBook();
        this.tuneBookIndex = new TuneBookIndex(tuneBook);
    }

    noResults(): boolean {
        return this.tunes.length === 0;
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
    }

    renderTune(tune: TuneBookEntry): boolean {
        this.tunes = [tune];
        return true;
    }
}
