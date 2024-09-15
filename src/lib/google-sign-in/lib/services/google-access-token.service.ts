import { Injectable } from '@angular/core';
import { forkJoin, ReplaySubject } from 'rxjs';
import { GoogleApiLoaderService } from './google-api-loader.service';

const ACCESS_TOKEN = 'accessToken';
const ACCESS_TOKEN_REFRESH = 'accessTokenRefresh';
const PREFERRED_ACCOUNT = 'preferredAccount';

@Injectable()
export class GoogleAccessTokenService {

    private accessToken: string;
    private tokenClient: TokenClient;

    readonly accessTokenSource = new ReplaySubject<string>(1);

    constructor(private googleApiLoader: GoogleApiLoaderService) {
        this.googleApiLoader.onClientLoaded().subscribe((client) => this.checkStoredAccessToken(client));
    }
    private checkStoredAccessToken(client: TokenClient): void {
        this.tokenClient = client;
        const accessToken = localStorage.getItem(ACCESS_TOKEN);

        if (accessToken) {
            if (this.isTokenValid()) {
                console.log('reusing stored access token');
                if (!this.accessToken) {
                    this.accessToken = accessToken;
                    gapi.client.setToken({ access_token: this.accessToken });
                    this.accessTokenSource.next(this.accessToken);
                }
            } else {
                this.fetchAccessToken();
            }
        }
    }

    private isTokenValid(): boolean {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        const refresh = parseInt(localStorage.getItem(ACCESS_TOKEN_REFRESH))
        const now = new Date().getTime();
        return accessToken && (now < refresh);
    }

    async fetchAccessToken(): Promise<string> {
        return new Promise((resolve) => {
            if (this.isTokenValid()) {
                resolve(this.accessToken);
            } else {
                this.googleApiLoader.onClientLoaded().subscribe(client => {
                    this.tokenClient = client;
                    client.callback = (response) => {
                        resolve(this.handleAccessToken(response));
                    };
                    client.requestAccessToken({login_hint: localStorage.getItem(PREFERRED_ACCOUNT)});
                });
            }
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
        if (this.accessToken && this.tokenClient) {
            localStorage.removeItem(ACCESS_TOKEN);
            localStorage.removeItem(ACCESS_TOKEN_REFRESH);    
            this.accessToken = '';
            this.accessTokenSource.next(this.accessToken);
        }
    }
}