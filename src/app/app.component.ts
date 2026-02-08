import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { Component, NgZone, OnInit, ViewChild, inject } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { GoogleAccessTokenService } from 'src/lib/google-sign-in/lib/services/google-access-token.service';
import { GoogleDriveService } from './service/google-drive.service';
import { TuneBookCollectionService } from './service/tunebook-collection.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatNavList, MatListItem } from '@angular/material/list';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CdkScrollable as CdkScrollable_1 } from '@angular/cdk/scrolling';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [MatToolbar, MatIconButton, MatIcon, MatSidenavContainer, MatSidenav, MatNavList, MatListItem, RouterLink, MatSidenavContent, CdkScrollable_1, RouterOutlet]
})
export class AppComponent implements OnInit {
    private breakpointObserver = inject(BreakpointObserver);
    private collectionService = inject(TuneBookCollectionService);
    private accessTokenService = inject(GoogleAccessTokenService);
    private googleDriveService = inject(GoogleDriveService);
    private zone = inject(NgZone);
    private scroll = inject(ScrollDispatcher);


    @ViewChild('snav', { static: false })
    sidenav: MatSidenav;

    signedIn: boolean;
    isHandset = false;
    toolbarVisible = true;

    private lastOffset: number;

    constructor() {

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
