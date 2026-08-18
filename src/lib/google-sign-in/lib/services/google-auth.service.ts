import { Injectable, inject } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { GoogleAccessTokenService } from './google-access-token.service';

export type GoogleAuthStatus = 'initializing' | 'signed-out' | 'signed-in' | 'error';

@Injectable()
export class GoogleAuthService {
    private accessTokenService = inject(GoogleAccessTokenService);

    private signedIn: boolean;
    private signInPending: boolean;
    private authStatusSource = new ReplaySubject<GoogleAuthStatus>(1);

    readonly authStatus = this.authStatusSource.asObservable();

    get authState(): Observable<string> {
        return this.accessTokenService.accessTokenSource;
    }

    constructor() {
        this.authStatusSource.next('initializing');

        this.authState.subscribe(auth => {
            this.signedIn = !!auth;
            this.signInPending = false;
            this.authStatusSource.next(this.signedIn ? 'signed-in' : 'signed-out');
        });

    }

    signIn(): void {
        this.signInPending = true;
        this.accessTokenService.fetchAccessToken().catch(() => {
            this.signInPending = false;
            this.authStatusSource.next('error');
        });
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
