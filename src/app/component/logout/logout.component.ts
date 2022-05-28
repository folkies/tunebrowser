import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthService } from 'src/lib/google-sign-in';

/**
 * Handles sign-out with Google.
 */
@Component({
    selector: 'app-logout',
    template: ''
})
export class LogoutComponent {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private googleAuth: GoogleAuthService) {

        this.route.url.subscribe(_ => this.onAction());
    }

    private onAction(): void {
        this.googleAuth.signOut();
        this.router.navigate(['/books']);
    }
    
}


