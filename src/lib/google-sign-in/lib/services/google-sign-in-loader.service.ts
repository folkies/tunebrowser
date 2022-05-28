import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import GoogleAuth = gapi.auth2.GoogleAuth;
import { GoogleApiLoaderService } from './google-api-loader.service';

const GSI_URL = 'https://accounts.google.com/gsi/client';

@Injectable()
export class GoogleSignInLoaderService {

    constructor() {
        this.loadGoogleSignIn().subscribe();
    }

    public onLoad(): Observable<boolean> {
        return this.loadGoogleSignIn();
    }

    private loadGoogleSignIn(): Observable<boolean> {
        return new Observable((observer: Observer<boolean>) => {
            let node = document.createElement('script');
            node.src = GSI_URL;
            node.type = 'text/javascript';
            node.charset = 'utf-8';
            document.getElementsByTagName('head')[0].appendChild(node);
            node.onload = () => {
                observer.next(true);
                observer.complete();
            };
        });
    }
}
