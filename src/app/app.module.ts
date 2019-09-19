import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TuneBookLoaderService } from './tunebook-loader.service';
import { TuneBookIndex } from './tunebook-index';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
      TuneBookIndex,
      TuneBookLoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
