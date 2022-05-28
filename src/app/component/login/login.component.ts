import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthService } from 'src/lib/google-sign-in';

/**
 * Handles sign-in with Google.
 */
@Component({
    selector: 'app-login',
    template: ''
})
export class LoginComponent {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private zone: NgZone,
        private googleAuth: GoogleAuthService) {

        this.route.url.subscribe(_ => this.onAction());

    }

    private onAction(): void {
        if (this.googleAuth.isSignedIn()) {
            this.zone.run(() => this.router.navigate(['/books']));
        } else {
            this.googleAuth.signIn();
        }
    }
}