import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from 'ngx-gapi-auth2';
import { TuneBookCollectionService } from 'src/app/service/tunebook-collection.service';
import { TuneBookReference } from '../../model/tunebook-reference';

@Component({
    selector: 'app-books-list',
    templateUrl: './books-list.component.html'
})
export class BooksListComponent {

    books: TuneBookReference[] = [];

    constructor(private collectionService: TuneBookCollectionService) {
        this.collectionService.collectionLoaded.subscribe(event => this.books = this.collectionService.getBooks());
    }

    isEditable(bookRef: TuneBookReference) {
        return bookRef.descriptor.storage === 'googledrive';
    }
}
