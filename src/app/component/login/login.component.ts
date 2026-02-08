import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthService } from 'src/lib/google-sign-in';

/**
 * Initiates sign-in with Google.
 */
@Component({
    selector: 'app-login',
    template: '',
    standalone: false
})
export class LoginComponent {

    private loginPending = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private zone: NgZone,
        private googleAuth: GoogleAuthService) {

        this.route.url.subscribe(_ => this.onAction());
        this.googleAuth.authState.subscribe(_ => {
            if (this.loginPending) {
                this.loginPending = false;
                this.zone.run(() => this.router.navigate(['/books']));
            }
        });

    }

    private onAction(): void {
        this.loginPending = true;
        this.googleAuth.signIn();
    }
}