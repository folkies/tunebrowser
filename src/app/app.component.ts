import { Component, OnInit } from '@angular/core';
import { TuneBookIndex } from './service/tunebook-index';
import { TuneBookLoaderService } from './service/tunebook-loader.service';
import { TuneBookDescriptor } from './model/tunebook-collection';
import { TuneBookReference } from './model/tunebook-reference';
import { TuneBookCollectionService } from './service/tunebook-collection.service';
import { GoogleDriveService } from './service/google-drive.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'folkies';

    constructor(
        private tuneBookLoaderService: TuneBookLoaderService, 
        private tuneBookIndex: TuneBookIndex, 
        private collectionService: TuneBookCollectionService,
        private googleDriveService: GoogleDriveService) {

    }

    async ngOnInit(): Promise<void> {
        // const tuneBookCollection = await this.tuneBookLoaderService.loadTuneBookCollection();
        // tuneBookCollection.books.forEach(descriptor => this.addBookToIndex(descriptor));
        await this.googleDriveService.initialize();
        this.collectionService.loadCollections();
    }

    private addBookToIndex(descriptor: TuneBookDescriptor): void {
        this.tuneBookLoaderService.loadTuneBook(descriptor.path)
            .then(tuneBook => this.tuneBookIndex.addTuneBook(new TuneBookReference(tuneBook, descriptor)));
    }

}
