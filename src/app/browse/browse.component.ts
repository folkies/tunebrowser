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
    book: string;

    constructor(private index: TuneBookIndex, private route: ActivatedRoute) {
        this.index.tuneBookReady.subscribe(event => this.onReady(event));
        this.route.paramMap.subscribe(paramMap => {
            this.book = paramMap.get('path');
            this.onReady(this.book);
        });
    }

    private onReady(event?: string) {
        this.entries = this.index.findAllTunes(this.book);
    }
}
