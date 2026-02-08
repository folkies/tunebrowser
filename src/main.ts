import { enableProdMode, importProvidersFrom } from '@angular/core';
import { configure, LogLevel } from '@log4js2/core';

import { LayoutModule } from '@angular/cdk/layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, RouteReuseStrategy, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { GSI_CONFIG } from 'src/lib/google-sign-in';
import { GoogleApiClientConfig } from 'src/lib/google-sign-in/lib/config/google-api.config';
import { GoogleSignInModule } from 'src/lib/google-sign-in/lib/google-sign-in.module';
import { AppComponent } from './app/app.component';
import { AboutComponent } from './app/component/about/about.component';
import { BookPrintComponent } from './app/component/book-print/book-print.component';
import { BooksListComponent } from './app/component/books-list/books-list.component';
import { CreateBookComponent } from './app/component/create-book/create-book.component';
import { LoginComponent } from './app/component/login/login.component';
import { LogoutComponent } from './app/component/logout/logout.component';
import { MatcherComponent } from './app/component/match/matcher.component';
import { PracticeComponent } from './app/component/practice/practice.component';
import { RecordComponent } from './app/component/record/record.component';
import { RepertoireComponent } from './app/component/repertoire/repertoire.component';
import { SearchComponent } from './app/component/search/search.component';
import { TuneEditorComponent } from './app/component/tune-editor/tune-editor.component';
import { TunePageComponent } from './app/component/tune-page/tune-page.component';
import { TunesListComponent } from './app/component/tunes-list/tunes-list.component';
import { CustomReuseStrategy } from './app/service/custom-reuse-strategy';
import { GoogleDriveTunebookLoaderService } from './app/service/google-drive-tunebook-loader.service';
import { GoogleDriveService } from './app/service/google-drive.service';
import { RestTuneMatcher } from './app/service/matching/rest-tune-matcher';
import { PdfService } from './app/service/pdf-service';
import { PracticeService } from './app/service/practice-service';
import { RepertoireRepository } from './app/service/repertoire-repository';
import { AudioContextProvider } from './app/service/transcription/audio-context-provider';
import { Recorder } from './app/service/transcription/recorder';
import { TranscriberProvider } from './app/service/transcription/transcriber-provider';
import { TuneBookCollectionService } from './app/service/tunebook-collection.service';
import { TuneBookIndex } from './app/service/tunebook-index';
import { TuneBookLoaderService } from './app/service/tunebook-loader.service';
import { environment } from './environments/environment';

const CLIENT_ID = '98237286064-bf0vbgpqqklhj434vifvfafvtckaja12.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive.file';

const googleApiClientConfig: GoogleApiClientConfig = {

    client_id: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
    prompt: ''
};
const appRoutes: Routes = [
    { path: 'about', component: AboutComponent },
    { path: 'books', component: BooksListComponent },
    { path: 'createBook', component: CreateBookComponent },
    { path: 'edit/:id', component: TuneEditorComponent },
    { path: 'book/:id', component: TunesListComponent },
    { path: 'print/:id', component: BookPrintComponent },
    { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'match/:transcription', component: MatcherComponent },
    { path: 'practice', component: PracticeComponent },
    { path: 'record', component: RecordComponent },
    { path: 'repertoire', component: RepertoireComponent },
    { path: 'search', component: SearchComponent },
    { path: 'tune/:bookId/:ref', component: TunePageComponent },
    {
        path: '',
        redirectTo: '/search',
        pathMatch: 'full'
    }
];



configure({
  level: LogLevel.INFO,
  virtualConsole: false
});

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserAnimationsModule, BrowserModule, GoogleSignInModule.forRoot({
            provide: GSI_CONFIG,
            useValue: googleApiClientConfig
        }), FormsModule, LayoutModule, MatAutocompleteModule, MatButtonModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatNativeDateModule, MatProgressBarModule, MatSelectModule, MatSidenavModule, MatSliderModule, MatSnackBarModule, MatSortModule, MatTableModule, MatToolbarModule, ReactiveFormsModule, ScrollingModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })),
        AudioContextProvider,
        Recorder,
        GoogleDriveService,
        GoogleDriveTunebookLoaderService,
        PdfService,
        PracticeService,
        RepertoireRepository,
        RestTuneMatcher,
        { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
        TranscriberProvider,
        TuneBookCollectionService,
        TuneBookIndex,
        TuneBookLoaderService,
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(appRoutes)
    ]
})
  .catch(err => console.error(err));
