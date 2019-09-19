import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SearchService } from 'src/app/search.service';
import { TuneBookLoaderService } from './tunebook-loader.service';

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
      SearchService,
      TuneBookLoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
