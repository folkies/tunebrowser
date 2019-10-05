import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TuneBookIndex } from '../service/tunebook-index';
import { TuneBookReference } from '../tunebook-reference';

@Component({
    selector: 'app-books-list',
    templateUrl: './books-list.component.html'
})
export class BooksListComponent {

    books: TuneBookReference[] = [];

    constructor(private index: TuneBookIndex, private route: ActivatedRoute) {
        this.index.tuneBookReady.subscribe(event => this.onReady(event));
        this.route.paramMap.subscribe(paramMap => this.onReady());
    }

    private onReady(event?: string) {
        this.books = this.index.getBooks();
    }
}
