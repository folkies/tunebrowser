import { Injectable } from '@angular/core';
import { ReplaySubject, timer } from 'rxjs';
import { GoogleApiLoaderService } from './google-api-loader.service';



@Injectable()
export class GoogleAccessTokenService {

    private accessToken: string;
    private tokenClient: TokenClient;

    readonly accessTokenSource = new ReplaySubject<string>(1);

    constructor(private googleApiLoader: GoogleApiLoaderService) {
        this.googleApiLoader.onClientLoaded().subscribe(() => this.checkStoredAccessToken());
    }
    checkStoredAccessToken(): void {
        const accessToken = localStorage.getItem("accessToken");
        const refresh = parseInt(localStorage.getItem("accessTokenRefresh"))
        const now = new Date().getTime();

        if (accessToken) {
            if (now < refresh) {
                console.log('reusing stored access token');
                this.accessToken = accessToken;
                gapi.client.setToken({access_token: this.accessToken});
                this.accessTokenSource.next(this.accessToken);
                timer(refresh - now).subscribe(() => {
                    console.log('refreshing access token');
                    this.fetchAccessToken();
                });
            } else {
                this.fetchAccessToken();
            }
        }
    }

    async fetchAccessToken(): Promise<string> {
        return new Promise((resolve) => {
            if (this.accessToken) {
                resolve(this.accessToken);
            } else {
                this.googleApiLoader.onClientLoaded().subscribe(client => {
                    this.tokenClient = client;
                    client.callback = (response) => {
                        resolve(this.handleAccessToken(response));
                    };
                    client.requestAccessToken();
                });
            }
        });
    }

    private handleAccessToken(response: TokenResponse): string {
        this.accessToken = response.access_token;
        this.accessTokenSource.next(this.accessToken);

        // refresh token after 80 % of lifetime
        const refreshDuration = response.expires_in * 800;
        timer(refreshDuration).subscribe(() => {
            console.log('refreshing access token');
            this.tokenClient.requestAccessToken();
        });

        localStorage.setItem("accessToken", this.accessToken);
        localStorage.setItem("accessTokenRefresh", (new Date().getTime() + refreshDuration).toString());

        return this.accessToken;
    }

    invalidate() {
        if (this.accessToken && this.tokenClient) {
            this.accessToken = '';
            this.accessTokenSource.next(this.accessToken);
        }
    }
}