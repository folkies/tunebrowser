import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleApiLoaderService } from './services/google-api-loader.service';
import { GoogleAuth2LoaderService } from './services/google-auth2-loader.service';
import { GoogleAuthService } from './services/google-auth.service';

@NgModule({
  imports: [CommonModule]
})
export class GoogleOauthModule {
  static forRoot(gapiConfigProvider: Provider): ModuleWithProviders<GoogleOauthModule> {
    return {
      ngModule: GoogleOauthModule,
      providers: [
        gapiConfigProvider,
        GoogleApiLoaderService,
        GoogleAuth2LoaderService,
        GoogleAuthService
      ]
    };
  }
}
