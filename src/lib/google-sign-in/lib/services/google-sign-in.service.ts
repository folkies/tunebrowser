import { Inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { GoogleApiClientConfig } from '../config/google-api.config';
import { GoogleSignInLoaderService } from './google-sign-in-loader.service';
import { GSI_CONFIG } from './google-api-loader.service';

const CREDENTIAL = "credential";


@Injectable()
export class GoogleSignInService {

    private authenticated = new ReplaySubject<string>(1);


    constructor(@Inject(GSI_CONFIG) config: GoogleApiClientConfig,
        private gsiLoader: GoogleSignInLoaderService) {


        // this.gsiLoader.onLoad().subscribe(() => {

        //     google.accounts.id.initialize({
        //         client_id: config.client_id,
        //         auto_select: true,
        //         use_fedcm_for_prompt: true,
        //         callback: (response: CredentialResponse) => {
        //             localStorage.setItem(CREDENTIAL, response.credential);
        //             this.authenticated.next(response.credential);
        //             this.authenticated.complete();
        //         },
        //     });
        //     const credential = localStorage.getItem(CREDENTIAL);
        //     if (this.isValid(credential)) {
        //         console.log("using stored credential");
        //         this.authenticated.next(credential);
        //         this.authenticated.complete();
        // } else {
        //         google.accounts.id.prompt((notification) => { });
        //     }
        // });
    }

    private isValid(credential: string): boolean {
        if (!credential) {
            return false;
        }
        const {exp} = JSON.parse(atob(credential.split('.')[1]));
        const now = new Date().getTime();
        return (now < exp*1000);
    }

    public onSignedIn(): Observable<string> {
        return this.authenticated;
    }


}
