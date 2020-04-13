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

    signedIn = false;

    constructor(private collectionService: TuneBookCollectionService,
        private googleAuth: GoogleAuthService) {
        this.googleAuth.authState.subscribe(auth => {
            this.signedIn = !!auth;
        });
        this.collectionService.collectionLoaded.subscribe(event => this.books = this.collectionService.getBooks());
    }

    isEditable(bookRef: TuneBookReference) {
        return bookRef.descriptor.storage === 'googledrive';
    }
}
