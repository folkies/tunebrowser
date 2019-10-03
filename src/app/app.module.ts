import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { SnippetViewComponent } from './snippet-view/snippet-view.component';
import { TunePlayerComponent } from './tune-player/tune-player.component';
import { TuneViewComponent } from './tune-view/tune-view.component';
import { TuneBookIndex } from './tunebook-index';
import { TuneBookLoaderService } from './tunebook-loader.service';
import { RouterModule, Routes } from '@angular/router';
import { BrowseComponent } from './browse/browse.component';
import { TunePageComponent } from './tune-page/tune-page.component';
import { SearchComponent } from './search/search.component';

const appRoutes: Routes = [
    { path: 'search', component: SearchComponent },
    { path: 'browse', component: BrowseComponent },
    { path: 'tune/:ref', component: TunePageComponent },
    {
        path: '',
        redirectTo: '/search',
        pathMatch: 'full'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        BrowseComponent,
        SearchComponent,
        TunePageComponent,
        TunePlayerComponent,
        TuneViewComponent,
        SnippetViewComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        RouterModule.forRoot(appRoutes),
        ScrollingModule
    ],
    providers: [
        TuneBookIndex,
        TuneBookLoaderService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
