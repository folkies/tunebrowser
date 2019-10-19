import { Component, OnInit } from '@angular/core';
import { TuneBookCollectionService } from 'src/app/service/tunebook-collection.service';
import { TuneBookReference } from '../../model/tunebook-reference';
import { GoogleDriveService } from 'src/app/service/google-drive.service';

@Component({
    selector: 'app-books-list',
    templateUrl: './books-list.component.html'
})
export class BooksListComponent implements OnInit {

    books: TuneBookReference[] = [];
    
    get signedOut(): boolean {
        return this.googleDriveService.isSignedOut();
    }

    constructor(private collectionService: TuneBookCollectionService, private googleDriveService: GoogleDriveService) {
    }

    ngOnInit() {
        this.books = this.collectionService.getBooks();
        this.collectionService.collectionLoaded.subscribe(event => this.books = this.collectionService.getBooks());
    }    

    isEditable(bookRef: TuneBookReference) {
        return bookRef.descriptor.storage === 'googledrive';
    }
}
