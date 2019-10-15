import { Component, OnInit } from '@angular/core';
import { TuneBookCollectionService } from 'src/app/service/tunebook-collection.service';
import { TuneBookReference } from '../../model/tunebook-reference';

@Component({
    selector: 'app-books-list',
    templateUrl: './books-list.component.html'
})
export class BooksListComponent implements OnInit {

    books: TuneBookReference[] = [];

    constructor(private collectionService: TuneBookCollectionService) {
    }

    ngOnInit() {
        this.books = this.collectionService.getBooks();
        this.collectionService.collectionLoaded.subscribe(event => this.books = this.collectionService.getBooks());
    }    

    createTuneBook() {

    }
}
