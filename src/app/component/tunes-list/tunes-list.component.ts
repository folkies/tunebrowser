import { Component, OnInit } from '@angular/core';
import { TuneBookEntry } from 'abcjs/midi';
import { ActivatedRoute } from '@angular/router';
import { TuneBookIndex } from 'src/app/service/tunebook-index';


@Component({
    selector: 'app-tunes-list',
    templateUrl: './tunes-list.component.html'
})
export class TunesListComponent {

    entries: TuneBookEntry[] = [];
    bookId: string;

    constructor(private index: TuneBookIndex, private route: ActivatedRoute) {
        this.index.tuneBookReady.subscribe(event => this.onReady(event));
        this.route.paramMap.subscribe(paramMap => {
            this.bookId = paramMap.get('id');
            this.onReady(this.bookId);
        });
    }

    bookName(): string {
        return this.index.getBookById(this.bookId).descriptor.name;
    }

    titleWithoutNumber(entry: TuneBookEntry): string {
        return entry.title.replace(/^\d+[a-z]?/, '');
    }

    private onReady(event?: string) {
        this.entries = this.index.findAllTunesInBook(this.bookId);
    }
}
