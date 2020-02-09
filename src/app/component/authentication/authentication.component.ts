import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleDriveService } from 'src/app/service/google-drive.service';

/**
 * Handles sign-in and sign-out with Google.
 */
@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html'
})
export class AuthenticationComponent {

    signedIn: boolean;

    constructor(private route: ActivatedRoute, private router: Router, private googleDrive: GoogleDriveService) {
        this.googleDrive.authenticationStatus.subscribe(authStatus => {
            this.signedIn = authStatus;
        });

        this.route.url.subscribe(segments => this.onAction(segments.pop().path));
    }

    private onAction(action: string) {
        if ('login' === action) {
            this.googleDrive.signIn();
        }
        else if ('logout' === action) {
            this.googleDrive.signOut();
        }
        this.router.navigate(['/books']);
    }
}