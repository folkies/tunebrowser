import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { GoogleAccessTokenService } from 'src/lib/google-sign-in/lib/services/google-access-token.service';
import { GoogleDriveService } from './service/google-drive.service';
import { TuneBookCollectionService } from './service/tunebook-collection.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    @ViewChild('snav', { static: false })
    sidenav: MatSidenav;

    signedIn: boolean;
    isHandset = false;
    toolbarVisible = true;

    private lastOffset: number;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private collectionService: TuneBookCollectionService,
        private accessTokenService: GoogleAccessTokenService,
        private googleDriveService: GoogleDriveService,
        private zone: NgZone,
        private scroll: ScrollDispatcher) {

        this.breakpointObserver.observe([
            Breakpoints.Handset
        ]).subscribe(result => {
            this.isHandset = result.matches;
        });


        this.scroll
            .scrolled()
            .subscribe((scrollable: CdkScrollable) => {
                this.zone.run(() => this.onWindowScroll(scrollable));
            });

        this.googleDriveService.driveApiLoaded.subscribe(_ => {
            this.accessTokenService.accessTokenSource.subscribe(accessToken => {
                this.zone.run(() => {
                    this.signedIn = !!accessToken
                    this.collectionService.loadCollections();
                });
            });
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
        this.collectionService.loadCollections();
    }

    private onWindowScroll(scrollable: CdkScrollable) {
        const scrollTop = scrollable.getElementRef().nativeElement.scrollTop || 0;
        let shouldShowToolbar = this.toolbarVisible;
        if (this.lastOffset > scrollTop + 10) {
            shouldShowToolbar = true;
        } else if (scrollTop < 10) {
            shouldShowToolbar = true;
        } else if (scrollTop > 50) {
            shouldShowToolbar = false;
        }
        this.lastOffset = scrollTop;
        this.toolbarVisible = !this.isHandset || shouldShowToolbar;
    }
}
