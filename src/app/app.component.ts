import { Component, OnInit } from '@angular/core';
import { GoogleDriveService } from './service/google-drive.service';
import { TuneBookCollectionService } from './service/tunebook-collection.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    signedIn: boolean;

    constructor(
        private collectionService: TuneBookCollectionService,
        private googleDriveService: GoogleDriveService) {

        this.googleDriveService.authenticationStatus.subscribe(authStatus => {
            this.signedIn = authStatus;
            console.info("observed signedIn = " + this.signedIn);
        });
    }

    async ngOnInit(): Promise<void> {
        await this.googleDriveService.initialize();
        this.collectionService.loadCollections();
    }
}
