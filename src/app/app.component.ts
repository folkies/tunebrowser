import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
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
    svgMap: Map<string, string> = new Map();

    private tuneBookIndex: TuneBookIndex;

    constructor(private tuneBookLoaderService: TuneBookLoaderService, private domSanitizer: DomSanitizer) {

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
        return this.tunes.length > 1;
    }

    findTunes(): void {
        this.tunes = this.tuneBookIndex.findTunes(this.query);
        if (this.uniqueResult()) {
            abcjs.renderAbc('notation', this.tunes[0].abc);
        } else if (this.multipleResults()) {
            this.tunes.forEach(tune => this.renderSnippet(tune));
        } else {
            abcjs.renderAbc('notation', '');
        }
    }

    renderTune(tune: TuneBookEntry) {
        this.tunes = [tune];
        abcjs.renderAbc('notation', tune.abc);
    }

    renderSnippet(tune: TuneBookEntry) {
        const snippet = this.buildSnippet(tune.abc);
        abcjs.renderAbc('notation', snippet);
        const notationElem = document.getElementById('notation');
        this.svgMap.set(tune.id, notationElem.innerHTML);
        notationElem.innerHTML = '';
    }

    private buildSnippet(abc: string): string {
        const lines = abc.split('\n');
        const filteredLines = [];
        let musicSeen = false;
        for (const line of lines) {
            if (/^[A-Za-z]:/.test(line)) {
                if (/^[XMLK]:/.test(line)) {
                    filteredLines.push(line);
                }
            } else {
                if (musicSeen) {
                    break;
                }
                const bars = line.split('|');
                if (bars.length > 1) {
                    musicSeen = true;
                    filteredLines.push(bars.slice(0, 2).join('|'));
                }
            }
        }
        return filteredLines.join('\n');
    }
}
