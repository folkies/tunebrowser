import { Injectable, inject } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { GoogleApiLoaderService } from './google-api-loader.service';

const ACCESS_TOKEN = 'accessToken';
const ACCESS_TOKEN_REFRESH = 'accessTokenRefresh';
const PREFERRED_ACCOUNT = 'preferredAccount';

@Injectable()
export class GoogleAccessTokenService {
    private googleApiLoader = inject(GoogleApiLoaderService);
    private accessToken: string;
    private accessTokenRequest: Promise<string>;
    readonly accessTokenSource = new ReplaySubject<string>(1);

    constructor() {
        this.googleApiLoader.onClientLoaded().subscribe({
            next: () => this.checkStoredAccessToken(),
            error: () => this.accessTokenSource.next('')
        });
    }
    private checkStoredAccessToken(): void {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);

        if (accessToken) {
            if (this.isTokenValid()) {
                console.log('reusing stored access token');
                if (!this.accessToken) {
                    this.accessToken = accessToken;
                    this.googleApiLoader.setToken(this.accessToken);
                    this.accessTokenSource.next(this.accessToken);
                }
            } else {
                this.fetchAccessToken().catch(() => this.accessTokenSource.next(''));
            }
        } else {
            this.accessTokenSource.next('');
        }
    }

    private isTokenValid(): boolean {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        const refresh = parseInt(localStorage.getItem(ACCESS_TOKEN_REFRESH), 10);
        const now = new Date().getTime();
        return !!accessToken && Number.isFinite(refresh) && now < refresh;
    }

    async fetchAccessToken(): Promise<string> {
        if (this.isTokenValid()) {
            this.accessToken ||= localStorage.getItem(ACCESS_TOKEN);
            return this.accessToken;
        }

        if (this.accessTokenRequest) {
            return this.accessTokenRequest;
        }

        this.accessTokenRequest = this.requestAccessToken();
        this.accessTokenRequest.then(
            () => this.accessTokenRequest = undefined,
            () => this.accessTokenRequest = undefined
        );
        return this.accessTokenRequest;
    }

    private requestAccessToken(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.googleApiLoader.onClientLoaded().subscribe({
                next: client => {
                    client.callback = (response) => {
                        if (response.error) {
                            reject(new Error(response.error_description || response.error));
                            return;
                        }
                        if (!response.access_token) {
                            reject(new Error('Google did not return an access token'));
                            return;
                        }
                        resolve(this.handleAccessToken(response));
                    };
                    client.requestAccessToken({ login_hint: localStorage.getItem(PREFERRED_ACCOUNT) });
                },
                error: reject
            });
        });
    }

    private handleAccessToken(response: TokenResponse): string {
        this.accessToken = response.access_token;

        // refresh token after 80 % of lifetime
        const refreshDuration = response.expires_in * 800;

        localStorage.setItem(ACCESS_TOKEN, this.accessToken);
        localStorage.setItem(ACCESS_TOKEN_REFRESH, (new Date().getTime() + refreshDuration).toString());

        const preferredAccount = localStorage.getItem(PREFERRED_ACCOUNT);
        if (!preferredAccount) {
            fetch('https://oauth2.googleapis.com/tokeninfo?access_token=' + this.accessToken)
            .then(resp => resp.json())
            .then(json => {
                if (json.email) {
                    localStorage.setItem(PREFERRED_ACCOUNT, json.email);
                }
            })
        }

        this.accessTokenSource.next(this.accessToken);
        return this.accessToken;
    }

    invalidate() {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(ACCESS_TOKEN_REFRESH);
        localStorage.removeItem(PREFERRED_ACCOUNT);
        this.accessToken = '';
        this.googleApiLoader.setToken('');
        this.accessTokenSource.next(this.accessToken);
    }
}