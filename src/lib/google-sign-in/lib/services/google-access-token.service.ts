import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { GoogleApiLoaderService } from './google-api-loader.service';



@Injectable()
export class GoogleAccessTokenService {

    private accessToken: string;
    private tokenClient: TokenClient;

    accessTokenSource = new ReplaySubject<string>(1);

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
                        this.accessToken = response.access_token;
                        this.accessTokenSource.next(this.accessToken);
                        resolve(this.accessToken);
                    };
                    client.requestAccessToken();
                });
            }
        });
    }

    invalidate() {
        if (this.accessToken && this.tokenClient) {
            this.accessToken = '';
            this.accessTokenSource.next(this.accessToken);
        }
    }
}