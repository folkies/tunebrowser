import { Inject, Injectable, InjectionToken } from '@angular/core';
import { forkJoin, Observable, ReplaySubject } from 'rxjs';
import { GoogleApiClientConfig } from '../config/google-api.config';
import { GoogleSignInLoaderService } from './google-sign-in-loader.service';

export let GSI_CONFIG: InjectionToken<GoogleApiClientConfig> =
    new InjectionToken<GoogleApiClientConfig>('gsi.config');

const GAPI_URL: string = 'https://apis.google.com/js/api.js';


@Injectable()
export class GoogleApiLoaderService {

    private client: TokenClient;

    private clientLoaded = new ReplaySubject<TokenClient>(1);
    private gapiLoaded = new ReplaySubject<boolean>(1);


    constructor(@Inject(GSI_CONFIG) config: GoogleApiClientConfig,
        private gsiLoader: GoogleSignInLoaderService) {

        this.loadGapi();

        forkJoin([this.onLoad(), this.gsiLoader.onLoad()]).subscribe(() => {

            this.client = google.accounts.oauth2.initTokenClient({
                client_id: config.client_id,
                scope: config.scope,
                callback: (_) => undefined,
                prompt: config.prompt || ''
            });

            this.clientLoaded.next(this.client);
            this.clientLoaded.complete();
        });
    }

    public onClientLoaded(): Observable<TokenClient> {
        return this.clientLoaded;
    }

    public onLoad(): Observable<boolean> {
        return this.gapiLoaded;
    }

    private loadGapi(): void {
        let node = document.createElement('script');
        node.src = GAPI_URL;
        node.type = 'text/javascript';
        node.onload = () => {
            gapi.load('client', () => {
                gapi.client.init({}).then(() => {
                    this.gapiLoaded.next(true);
                    this.gapiLoaded.complete();
                })
            })
        };
        document.getElementsByTagName('head')[0].appendChild(node);
    }
}
