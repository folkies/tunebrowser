/// <reference types="gapi.auth2" />
import { Injectable } from '@angular/core';
import { Observable, Observer, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import GoogleAuth = gapi.auth2.GoogleAuth;
import { GoogleApiLoaderService } from './google-api-loader.service';


@Injectable()
export class GoogleAuth2LoaderService {
  private GoogleAuth: GoogleAuth = undefined;

  constructor(private googleApi: GoogleApiLoaderService) {
    this.googleApi.onLoad().subscribe(() => {
      this.loadGoogleAuth2().subscribe();
    });
  }

  public getAuth(newInstance = false): Observable<GoogleAuth> {
    if (!this.GoogleAuth || newInstance) {
      return this.googleApi.onLoad()
        .pipe(mergeMap(() => this.loadGoogleAuth2()));
    }
    return of(this.GoogleAuth);
  }

  private loadGoogleAuth2(): Observable<GoogleAuth> {
    return new Observable((observer: Observer<GoogleAuth>) => {
      gapi.load('auth2', () => {
        gapi.auth2.init(this.googleApi.getConfig().getClientConfig()).then((auth: GoogleAuth) => {
          this.GoogleAuth = auth;
          observer.next(auth);
          observer.complete();
        }).catch((err: any) => observer.error(err));
      });
    });
  }
}
