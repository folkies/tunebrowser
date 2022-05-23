import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthService } from 'src/lib/ngx-gapi-auth2';

/**
 * Handles sign-out with Google.
 */
@Component({
    selector: 'app-logout',
    template: ''
})
export class LogoutComponent {

    constructor(
        private router: Router,
        private googleAuth: GoogleAuthService) {

        this.googleAuth.signOut();
        this.router.navigate(['/books']);
    }
}