import { Component, OnInit } from '@angular/core';
import abcjs, { TuneBookEntry } from 'abcjs';
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
    private tuneBookIndex: TuneBookIndex;

    constructor(private tuneBookLoaderService: TuneBookLoaderService) {

    }

    async ngOnInit(): Promise<void> {
        const tuneBook = await this.tuneBookLoaderService.loadTuneBook();
        this.tuneBookIndex = new TuneBookIndex(tuneBook);
    }

    get abcText(): string {
        return this.rawAbc;
    }

    set abcText(text: string) {
        this.rawAbc = text;
        console.log('new text: ' + this.rawAbc);
        abcjs.renderAbc('notation', this.rawAbc);
    }

    noResults(): boolean {
        return this.tunes.length === 0;
    }

    uniqueResult(): boolean {
        return this.tunes.length === 1;
    }

    multipleResults(): boolean {
        return this.tunes.length > 1;
    }

    findTunes(): void {
        this.tunes = this.tuneBookIndex.findTunes(this.query);
        if (this.uniqueResult()) {
            abcjs.renderAbc('notation', this.tunes[0].abc);
        } else {
            abcjs.renderAbc('notation', '');
        }
    }
}
