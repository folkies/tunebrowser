import { Component, inject } from '@angular/core';
import { TuneBookCollectionService } from 'src/app/service/tunebook-collection.service';
import { GoogleAuthService } from 'src/lib/google-sign-in';
import { TuneBookReference } from '../../model/tunebook-reference';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIconButton, MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-books-list',
    templateUrl: './books-list.component.html',
    imports: [MatList, MatListItem, MatIconButton, RouterLink, MatIcon, MatButton]
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
