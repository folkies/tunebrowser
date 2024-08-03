import { Inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { GoogleApiClientConfig } from '../config/google-api.config';
import { GoogleSignInLoaderService } from './google-sign-in-loader.service';
import { GSI_CONFIG } from './google-api-loader.service';




@Injectable()
export class GoogleSignInService {

    private authenticated = new ReplaySubject<CredentialResponse>(1);


    constructor(@Inject(GSI_CONFIG) config: GoogleApiClientConfig,
        private gsiLoader: GoogleSignInLoaderService) {


        this.gsiLoader.onLoad().subscribe(() => {

            google.accounts.id.initialize({
                client_id: config.client_id,
                auto_select: true,
                callback: (response: CredentialResponse) => {
                    this.authenticated.next(response);
                    this.authenticated.complete();
                },
            });
            google.accounts.id.prompt((notification) => {});

        });
    }

    public onSignedIn(): Observable<CredentialResponse> {
        return this.authenticated;
    }


}
