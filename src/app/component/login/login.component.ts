import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuth2LoaderService } from 'src/lib/ngx-gapi-auth2';

/**
 * Handles sign-in with Google.
 */
@Component({
    selector: 'app-login',
    template: ''
})
export class LoginComponent {

    private auth: gapi.auth2.GoogleAuth;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private zone: NgZone,
        private googleApiLoaderService: GoogleAuth2LoaderService) {

        this.route.url.subscribe(_ => this.onAction());

        this.googleApiLoaderService.getAuth().subscribe(auth => {
            this.auth = auth;
            this.onAction();
        });
    }

    private onAction(): void {
        if (this.auth) {
            if (this.auth.isSignedIn.get()) {
                this.zone.run(() => this.router.navigate(['/books']));
            } else {
                this.auth.signIn();
            }
        }
    }
}