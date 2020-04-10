import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/overlay';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { GoogleAuthService } from 'ngx-gapi-auth2';
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

    private initialized = false;
    private lastOffset: number;

    constructor(
        private breakpointObserver: BreakpointObserver,
        private collectionService: TuneBookCollectionService,
        private googleAuth: GoogleAuthService,
        private zone: NgZone,
        private scroll: ScrollDispatcher) {

        this.breakpointObserver.observe([
            Breakpoints.Handset
        ]).subscribe(result => {
            this.isHandset = result.matches;
        });

        this.googleAuth.authState.subscribe(authStatus => {
            this.signedIn = authStatus != null;
            if (this.initialized) {
                this.collectionService.loadCollections();
            }
        });

        this.scroll
            .scrolled()
            .subscribe((scrollable: CdkScrollable) => {
                this.zone.run(() => this.onWindowScroll(scrollable));
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
        this.initialized = true;
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
