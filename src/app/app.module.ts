import { LayoutModule } from '@angular/cdk/layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
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
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { GSI_CONFIG } from 'src/lib/google-sign-in';
import { GoogleApiClientConfig } from 'src/lib/google-sign-in/lib/config/google-api.config';
import { GoogleSignInModule } from 'src/lib/google-sign-in/lib/google-sign-in.module';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AboutComponent } from './component/about/about.component';
import { AddToRepertoireComponent } from './component/add-to-repertoire/add-to-repertoire.component';
import { BookPrintComponent } from './component/book-print/book-print.component';
import { BooksListComponent } from './component/books-list/books-list.component';
import { CreateBookComponent } from './component/create-book/create-book.component';
import { LoginComponent } from './component/login/login.component';
import { LogoutComponent } from './component/logout/logout.component';
import { MatcherComponent } from './component/match/matcher.component';
import { NewRepertoireComponent } from './component/new-repertoire/new-repertoire.component';
import { PracticeComponent } from './component/practice/practice.component';
import { RecordComponent } from './component/record/record.component';
import { RepertoireComponent } from './component/repertoire/repertoire.component';
import { SearchComponent } from './component/search/search.component';
import { SnippetViewComponent } from './component/snippet-view/snippet-view.component';
import { TuneEditorComponent } from './component/tune-editor/tune-editor.component';
import { TunePageComponent } from './component/tune-page/tune-page.component';
import { TunePlayerComponent } from './component/tune-player/tune-player.component';
import { TuneViewComponent } from './component/tune-view/tune-view.component';
import { TunesListComponent } from './component/tunes-list/tunes-list.component';
import { CaretTrackerDirective } from './directive/caret-tracker.directive';
import { CustomReuseStrategy } from './service/custom-reuse-strategy';
import { GoogleDriveTunebookLoaderService } from './service/google-drive-tunebook-loader.service';
import { GoogleDriveService } from './service/google-drive.service';
import { RestTuneMatcher } from './service/matching/rest-tune-matcher';
import { PdfService } from './service/pdf-service';
import { PracticeService } from './service/practice-service';
import { RepertoireRepository } from './service/repertoire-repository';
import { AudioContextProvider } from './service/transcription/audio-context-provider';
import { Recorder } from './service/transcription/recorder';
import { TranscriberProvider } from './service/transcription/transcriber-provider';
import { TuneBookCollectionService } from './service/tunebook-collection.service';
import { TuneBookIndex } from './service/tunebook-index';
import { TuneBookLoaderService } from './service/tunebook-loader.service';
import { DeleteRepertoireItemComponent } from './component/delete-repertoire-item/delete-repertoire-item.component';

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

const CLIENT_ID = '98237286064-bf0vbgpqqklhj434vifvfafvtckaja12.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive.file';


const googleApiClientConfig: GoogleApiClientConfig = {

    client_id: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES,
    prompt: ''
};
  

@NgModule({ declarations: [
        AboutComponent,
        NewRepertoireComponent,
        DeleteRepertoireItemComponent,
        AddToRepertoireComponent,
        AppComponent,
        BookPrintComponent,
        BooksListComponent,
        CaretTrackerDirective,
        CreateBookComponent,
        LoginComponent,
        LogoutComponent,
        MatcherComponent,
        PracticeComponent,
        RecordComponent,
        RepertoireComponent,
        SearchComponent,
        TuneEditorComponent,
        TunePageComponent,
        TunePlayerComponent,
        TuneViewComponent,
        TunesListComponent,
        SnippetViewComponent,
        BooksListComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserAnimationsModule,
        BrowserModule,
        GoogleSignInModule.forRoot({
            provide: GSI_CONFIG,
            useValue: googleApiClientConfig
        }),
        FormsModule,
        LayoutModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes),
        ScrollingModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })], providers: [
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
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
