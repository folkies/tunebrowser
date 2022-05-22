import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuth2LoaderService, GoogleAuthService } from 'src/lib/ngx-gapi-auth2';

/**
 * Handles sign-in and sign-out with Google.
 */
@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html'
})
export class AuthenticationComponent {

    signedIn: boolean;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private googleAuth: GoogleAuthService,
        private googleApiLoaderService: GoogleAuth2LoaderService) {

        this.route.url.subscribe(segments => this.onAction(segments.pop().path));
        this.googleAuth.authState.subscribe(auth => {
            if (auth == null) {
                this.signedIn = false;
            } else {
                this.signedIn = true;
                this.router.navigate(['/books']);
            }
        });

        this.googleApiLoaderService.getAuth().subscribe(auth => {
            if (!auth.isSignedIn.get()) {
                console.log("signing in")
                auth.signIn();
            }
        });
    }

    private onAction(action: string) {
        if ('logout' === action) {
            this.googleAuth.signOut();
            this.signedIn = false;
            this.router.navigate(['/books']);
        }
    }
}