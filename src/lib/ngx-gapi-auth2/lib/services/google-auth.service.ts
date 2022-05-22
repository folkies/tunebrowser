import { Injectable, NgZone } from '@angular/core';
import { interval, Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';


import { GoogleAuth2LoaderService } from './google-auth2-loader.service';
import { GoogleApiLoaderService } from './google-api-loader.service';
import { AuthUser } from '../models/auth';


@Injectable()
export class GoogleAuthService {
  private _authState: ReplaySubject<AuthUser> = new ReplaySubject(1);
  private auth: gapi.auth2.GoogleAuth;

  get authState(): Observable<AuthUser> {
    return this._authState.asObservable();
  }

  constructor(
    private googleAuth2LoaderService: GoogleAuth2LoaderService,
    private googleApiLoaderService: GoogleApiLoaderService,
    private ngZone: NgZone
  ) {


    if (this.googleApiLoaderService.isMocked()) {
      this.signIn();
    } else {
      this.googleApiLoaderService.onLoad().subscribe(() => {
        this.googleAuth2LoaderService.getAuth().subscribe(auth => {
          this.auth = auth;
          if (this.auth.currentUser.get().isSignedIn()) {
            this.refreshToken();
          } else {
            this._authState.next(null);
          }
        });
        interval(20 * 60 * 1000).pipe(  // run every 20min
          tap(() => this.refreshToken())
        ).subscribe();
      });
    }
  }

  public signIn(): void {
    if (this.googleApiLoaderService.isMocked()) {
      this._authState.next(JSON.parse(localStorage.getItem('user')));
    } else {
      this.auth.signIn({
        prompt: 'select_account',
        ux_mode: 'redirect',
        redirect_uri: window.location.origin
      });
    }
  }

  public signOut(): void {
    if (!this.googleApiLoaderService.isMocked()) {
      this.auth.signOut();
    }
    this._authState.next(null);
  }

  public refreshToken(): Promise<void> {
    return this.auth.currentUser.get().reloadAuthResponse().then(r => {
      this.ngZone.run(() => this._authState.next(this.getProfile(r.id_token, r.expires_at)));
    });
  }

  private getProfile(token: string, expiresAt: number): AuthUser {
    const p = this.auth.currentUser.get().getBasicProfile();
    return p ? {
      id: p.getId(),
      email: p.getEmail(),
      firstName: p.getGivenName(),
      lastName: p.getFamilyName(),
      avatar: p.getImageUrl(),
      idToken: token,
      tokenExpiresAt: expiresAt
    } : null;
  }
}
