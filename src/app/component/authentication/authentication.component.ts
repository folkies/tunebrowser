import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoogleDriveService } from 'src/app/service/google-drive.service';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html'
})
export class AuthenticationComponent {

    signedIn: boolean;

    constructor(private route: ActivatedRoute, private googleDrive: GoogleDriveService) {
        this.googleDrive.authenticationStatus.subscribe(authStatus => {
            this.signedIn = authStatus;
            console.info("observed signedIn = " + this.signedIn);
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
    }
}