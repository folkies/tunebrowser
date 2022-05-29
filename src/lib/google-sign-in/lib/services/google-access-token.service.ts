import { Injectable } from '@angular/core';
import { ReplaySubject, timer } from 'rxjs';
import { GoogleApiLoaderService } from './google-api-loader.service';



@Injectable()
export class GoogleAccessTokenService {

    private accessToken: string;
    private tokenClient: TokenClient;

    readonly accessTokenSource = new ReplaySubject<string>(1);

    constructor(private googleApiLoader: GoogleApiLoaderService) {
    }

    async fetchAccessToken(): Promise<string> {
        return new Promise((resolve, reject) => {
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
        
        return this.accessToken;
    }

    invalidate() {
        if (this.accessToken && this.tokenClient) {
            this.accessToken = '';
            this.accessTokenSource.next(this.accessToken);
        }
    }
}