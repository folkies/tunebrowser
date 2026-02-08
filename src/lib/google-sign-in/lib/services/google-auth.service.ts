import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { GoogleAccessTokenService } from './google-access-token.service';

@Injectable()
export class GoogleAuthService {
    private accessTokenService = inject(GoogleAccessTokenService);

    private signedIn: boolean;
    private signInPending: boolean;

    get authState(): Observable<string> {
        return this.accessTokenService.accessTokenSource;
    }

    constructor() {

        this.authState.subscribe(auth => {
            this.signedIn = !!auth;
            this.signInPending = false;
        });

    }

    signIn(): void {
        this.signInPending = true;
        this.accessTokenService.fetchAccessToken();
    }

    refresh(): Promise<string> {
        return this.accessTokenService.fetchAccessToken();
    }
    
    signOut(): void {
        this.accessTokenService.invalidate();
    }

    isSignedIn(): boolean {
        return this.signedIn;
    }

    isSignInPending(): boolean {
        return this.signInPending;
    }

}
