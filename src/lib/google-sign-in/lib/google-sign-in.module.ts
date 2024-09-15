import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { GoogleAccessTokenService } from './services/google-access-token.service';
import { GoogleApiLoaderService } from './services/google-api-loader.service';
import { GoogleAuthService } from './services/google-auth.service';
import { GoogleSignInLoaderService } from './services/google-sign-in-loader.service';


@NgModule({
    imports: [CommonModule]
})
export class GoogleSignInModule {
    static forRoot(gsiConfigProvider: Provider): ModuleWithProviders<GoogleSignInModule> {
        return {
            ngModule: GoogleSignInModule,
            providers: [
                gsiConfigProvider,
                GoogleAccessTokenService,
                GoogleApiLoaderService,
                GoogleAuthService,
                GoogleSignInLoaderService,
            ]
        };
    }
}
