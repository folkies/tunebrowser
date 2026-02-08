import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnalyzedTune } from 'abcjs';
import { titleWithoutNumber } from 'src/app/service/abc-util';
import { TuneBookIndex } from 'src/app/service/tunebook-index';

@Component({
    selector: 'app-tunes-list',
    templateUrl: './tunes-list.component.html',
    standalone: false
})
export class TunesListComponent {

    entries: AnalyzedTune[] = [];
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
        return this.index.getBookById(this.bookId)?.descriptor.name;
    }

    private onReady(event?: string) {
        if (event == this.bookId) {
            this.entries = this.index.findAllTunesInBook(event);
        }
    }
}
