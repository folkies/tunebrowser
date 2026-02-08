import { Component, inject } from '@angular/core';
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
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private googleAuth = inject(GoogleAuthService);


    constructor() {

        this.route.url.subscribe(() => this.onAction());
    }

    private onAction(): void {
        this.googleAuth.signOut();
        this.router.navigate(['/books']);
    }
    
}


