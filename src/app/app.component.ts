import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleDriveService } from './service/google-drive.service';
import { TuneBookCollectionService } from './service/tunebook-collection.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    @ViewChild('snav', { static: false }) 
    public sidenav: MatSidenav;    
    
    private initialized = false;
    signedIn: boolean;
    isHandset = false;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private collectionService: TuneBookCollectionService,
        private googleDriveService: GoogleDriveService) {

        this.breakpointObserver.observe([
            Breakpoints.Handset
        ]).subscribe(result => {
            this.isHandset = result.matches;
        });

        this.googleDriveService.authenticationStatus.subscribe(authStatus => {
            this.signedIn = authStatus;
            console.info("observed signedIn = " + this.signedIn);
            if (this.initialized) {
                this.collectionService.loadCollections();
            }
        });
    }

    sidenavMode(): string {
        return this.isHandset ? 'over' : 'side';
    }

    onClick(): void {
        if (this.isHandset) {
            this.sidenav.close();
        }
    }
    async ngOnInit(): Promise<void> {
        await this.googleDriveService.initialize();
        this.collectionService.loadCollections();
        this.initialized = true;
    }
}
