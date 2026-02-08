import { Component } from '@angular/core';
import { TuneBookCollectionService } from 'src/app/service/tunebook-collection.service';
import { GoogleAuthService } from 'src/lib/google-sign-in';
import { TuneBookReference } from '../../model/tunebook-reference';

@Component({
    selector: 'app-books-list',
    templateUrl: './books-list.component.html',
    standalone: false
})
export class BooksListComponent {

    books: TuneBookReference[] = [];

    signedIn = false;

    constructor(private collectionService: TuneBookCollectionService,
        private googleAuth: GoogleAuthService) {
        this.googleAuth.authState.subscribe(auth => {
            this.signedIn = !!auth;
        });
        this.collectionService.collectionLoaded.subscribe(() => this.books = this.collectionService.getBooks());
    }

    isEditable(bookRef: TuneBookReference) {
        return bookRef.descriptor.storage === 'googledrive';
    }
}
