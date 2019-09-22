import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { AppComponent } from './app.component';
import { SnippetViewComponent } from './snippet-view/snippet-view.component';
import { TuneViewComponent } from './tune-view/tune-view.component';
import { TuneBookIndex } from './tunebook-index';
import { TuneBookLoaderService } from './tunebook-loader.service';

@NgModule({
    declarations: [
        AppComponent,
        TuneViewComponent,
        SnippetViewComponent
    ],
    imports: [
        BrowserModule,
        ButtonModule,
        HttpClientModule,
        InputTextModule,
        FormsModule,
        TableModule
    ],
    providers: [
        TuneBookIndex,
        TuneBookLoaderService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
