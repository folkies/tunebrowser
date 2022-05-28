import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleAccessTokenService } from './google-access-token.service';

@Injectable()
export class GoogleAuthService {
    private signedIn: boolean;

    get authState(): Observable<string> {
        return this.accessTokenService.accessTokenSource;
    }

    constructor(
        private accessTokenService: GoogleAccessTokenService) {

        this.authState.subscribe(auth => {
            this.signedIn = !!auth;
        });

    }

    signIn(): void {
        this.accessTokenService.fetchAccessToken();
    }

    signOut(): void {
        this.accessTokenService.invalidate();
    }

    isSignedIn(): boolean {
        return this.signedIn;
    }

}
