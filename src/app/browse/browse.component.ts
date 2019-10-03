import { Component, OnInit } from '@angular/core';
import { TuneBookIndex } from '../tunebook-index';
import { TuneBookEntry } from 'abcjs/midi';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-browse',
    templateUrl: './browse.component.html'
})
export class BrowseComponent {

    entries: TuneBookEntry[] = [];

    constructor(private index: TuneBookIndex, private route: ActivatedRoute) {
        this.index.tuneBookReady.subscribe(event => this.onReady(event));
        this.route.paramMap.subscribe(paramMap => this.onReady());
    }

    private onReady(event?: string) {
        if (this.entries.length === 0 || event !== undefined) {
            this.entries = this.index.findAllTunes();
        }
    }
}
