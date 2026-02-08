import { Component, inject } from '@angular/core';
import { TuneBookCollectionService } from 'src/app/service/tunebook-collection.service';
import { GoogleAuthService } from 'src/lib/google-sign-in';
import { TuneBookReference } from '../../model/tunebook-reference';

@Component({
    selector: 'app-books-list',
    templateUrl: './books-list.component.html',
    standalone: false
})
export class BooksListComponent {
    private collectionService = inject(TuneBookCollectionService);
    private googleAuth = inject(GoogleAuthService);


    books: TuneBookReference[] = [];

    signedIn = false;

    constructor() {
        this.googleAuth.authState.subscribe(auth => {
            this.signedIn = !!auth;
        });
        this.collectionService.collectionLoaded.subscribe(() => this.books = this.collectionService.getBooks());
    }

    isEditable(bookRef: TuneBookReference) {
        return bookRef.descriptor.storage === 'googledrive';
    }
}
