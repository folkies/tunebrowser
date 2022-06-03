import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TuneBookEntry } from 'abcjs/midi';
import { titleWithoutNumber } from 'src/app/service/abc-util';
import { TuneBookIndex } from 'src/app/service/tunebook-index';

@Component({
    selector: 'app-tunes-list',
    templateUrl: './tunes-list.component.html'
})
export class TunesListComponent {

    entries: TuneBookEntry[] = [];
    bookId: string;

    titleWithoutNumber = titleWithoutNumber;
    
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

    private onReady(event?: string) {
        this.entries = this.index.findAllTunesInBook(event);
    }
}
