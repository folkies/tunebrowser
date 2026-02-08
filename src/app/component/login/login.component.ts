import { Component, NgZone, inject } from '@angular/core';
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
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private zone = inject(NgZone);
    private googleAuth = inject(GoogleAuthService);


    private loginPending = false;

    constructor() {

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