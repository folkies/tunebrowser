import { Inject, Injectable, InjectionToken } from '@angular/core';
import { forkJoin, Observable, Observer, ReplaySubject } from 'rxjs';
import { GoogleApiClientConfig, GoogleApiConfig2 } from '../config/google-api.config';
import { GoogleSignInLoaderService } from './google-sign-in-loader.service';

export let GSI_CONFIG: InjectionToken<GoogleApiClientConfig> =
    new InjectionToken<GoogleApiClientConfig>('gsi.config');



@Injectable()
export class GoogleApiLoaderService {
    private readonly gapiUrl: string = 'https://apis.google.com/js/api.js';
    private readonly config: GoogleApiConfig2;

    private client: any;

    private clientLoaded = new ReplaySubject<TokenClient>(1);


    constructor(@Inject(GSI_CONFIG) config: GoogleApiClientConfig,
        private gsiLoader: GoogleSignInLoaderService) {
        this.config = new GoogleApiConfig2(config);
        forkJoin([this.onLoad(), this.gsiLoader.onLoad()]).subscribe(() => {

            this.client = google.accounts.oauth2.initTokenClient({
                client_id: config.client_id,
                scope: config.scope,
                callback: '',
                prompt: ''
            });

            this.clientLoaded.next(this.client);
            this.clientLoaded.complete();
        });
    }

    public onClientLoaded(): Observable<TokenClient> {
        return this.clientLoaded;
    }


    public onLoad(): Observable<boolean> {
        return this.loadGapi();
    }

    public getConfig(): GoogleApiConfig2 {
        return this.config;
    }



    private loadGapi(): Observable<boolean> {
        return new Observable((observer: Observer<boolean>) => {
            let node = document.createElement('script');
            node.src = this.gapiUrl;
            node.type = 'text/javascript';
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
            node.onload = () => {
                gapi.load('client', function () {
                    gapi.client.init({}).then(() => {

                        observer.next(true);
                        observer.complete();
                    })
                })
            };
        });
    }
}
