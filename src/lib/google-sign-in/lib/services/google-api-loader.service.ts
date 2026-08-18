import { Injectable, InjectionToken, inject } from '@angular/core';
import { forkJoin, Observable, ReplaySubject } from 'rxjs';
import { GoogleApiClientConfig } from '../config/google-api.config';
import { GoogleSignInLoaderService } from './google-sign-in-loader.service';

export const GSI_CONFIG: InjectionToken<GoogleApiClientConfig> =
    new InjectionToken<GoogleApiClientConfig>('gsi.config');

const GAPI_URL = 'https://apis.google.com/js/api.js';


@Injectable()
export class GoogleApiLoaderService {
    private gsiLoader = inject(GoogleSignInLoaderService);


    private client: TokenClient;

    private clientLoaded = new ReplaySubject<TokenClient>(1);
    private gapiLoaded = new ReplaySubject<boolean>(1);


    constructor() {
        const config = inject<GoogleApiClientConfig>(GSI_CONFIG);


        this.loadGapi();

        forkJoin([this.onLoad(), this.gsiLoader.onLoad()]).subscribe({
            next: ([_1, _2]) => {

            this.client = google.accounts.oauth2.initTokenClient({
                client_id: config.client_id,
                scope: config.scope,
                callback: () => undefined,
                prompt: config.prompt || ''
            });

            this.clientLoaded.next(this.client);
            this.clientLoaded.complete();
            },
            error: error => this.clientLoaded.error(error)
        });
    }

    public onClientLoaded(): Observable<TokenClient> {
        return this.clientLoaded;
    }

    public onLoad(): Observable<boolean> {
        return this.gapiLoaded;
    }

    public setToken(accessToken: string): void {
        gapi.client.setToken({ access_token: accessToken });
    }

    private loadGapi(): void {
        const existingScript = document.querySelector(`script[src="${GAPI_URL}"]`);
        if (existingScript && typeof gapi !== 'undefined') {
            gapi.load('client', () => {
                gapi.client.init({}).then(() => {
                    this.gapiLoaded.next(true);
                    this.gapiLoaded.complete();
                }).catch(error => this.gapiLoaded.error(error));
            });
            return;
        }

        const node = document.createElement('script');
        node.src = GAPI_URL;
        node.type = 'text/javascript';
        node.onload = () => {
            gapi.load('client', () => {
                gapi.client.init({}).then(() => {
                    this.gapiLoaded.next(true);
                    this.gapiLoaded.complete();
                }).catch(error => this.gapiLoaded.error(error));
            })
        };
        node.onerror = () => this.gapiLoaded.error(new Error('Unable to load the Google API client'));
        document.getElementsByTagName('head')[0].appendChild(node);
    }
}
