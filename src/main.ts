import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { configure, LogLevel } from '@log4js2/core';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

configure({
  level: LogLevel.INFO,
  virtualConsole: false
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
  .catch(err => console.error(err));
