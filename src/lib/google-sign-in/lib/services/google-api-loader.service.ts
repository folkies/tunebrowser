import { Inject, Injectable, InjectionToken } from '@angular/core';
import { forkJoin, Observable, ReplaySubject } from 'rxjs';
import { GoogleApiClientConfig } from '../config/google-api.config';
import { GoogleSignInLoaderService } from './google-sign-in-loader.service';
import { GoogleSignInService } from './google-sign-in.service';

export const GSI_CONFIG: InjectionToken<GoogleApiClientConfig> =
    new InjectionToken<GoogleApiClientConfig>('gsi.config');

const GAPI_URL = 'https://apis.google.com/js/api.js';


@Injectable()
export class GoogleApiLoaderService {

    private client: TokenClient;

    private clientLoaded = new ReplaySubject<TokenClient>(1);
    private gapiLoaded = new ReplaySubject<boolean>(1);


    constructor(@Inject(GSI_CONFIG) config: GoogleApiClientConfig,
        private gsiLoader: GoogleSignInLoaderService,
    private signIn: GoogleSignInService) {

        this.loadGapi();

        forkJoin([this.onLoad(), this.gsiLoader.onLoad(), this.signIn.onSignedIn()]).subscribe(([_1, _2, credential]) => {

            this.client = google.accounts.oauth2.initTokenClient({
                client_id: config.client_id,
                login_hint: this.extractEmail(credential),
                scope: config.scope,
                callback: () => undefined,
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
        const node = document.createElement('script');
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

    private extractEmail(credential:string): string {
        const {email, sub} = JSON.parse(atob(credential.split('.')[1]));
        return email;
    }
}
