import { LayoutModule } from '@angular/cdk/layout';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
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
import { AppComponent } from './app.component';
import { AboutComponent } from './component/about/about.component';
import { AddToRepertoireComponent } from './component/add-to-repertoire/add-to-repertoire.component';
import { AuthenticationComponent } from './component/authentication/authentication.component';
import { BooksListComponent } from './component/books-list/books-list.component';
import { CreateBookComponent } from './component/create-book/create-book.component';
import { MatcherComponent } from './component/match/matcher.component';
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
import { TuneMatcherProvider } from './service/matching/tune-matcher-provider';
import { PracticeService } from './service/practice-service';
import { RepertoireRepository } from './service/repertoire-repository';
import { AudioContextProvider } from './service/transcription/audio-context-provider';
import { Recorder } from './service/transcription/recorder';
import { TranscriberProvider } from './service/transcription/transcriber-provider';
import { TuneBookCollectionService } from './service/tunebook-collection.service';
import { TuneBookIndex } from './service/tunebook-index';
import { TuneBookLoaderService } from './service/tunebook-loader.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

const appRoutes: Routes = [
    { path: 'about', component: AboutComponent },
    { path: 'books', component: BooksListComponent },
    { path: 'createBook', component: CreateBookComponent },
    { path: 'edit/:id', component: TuneEditorComponent },
    { path: 'book/:id', component: TunesListComponent },
    { path: 'login', component: AuthenticationComponent },
    { path: 'logout', component: AuthenticationComponent },
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

@NgModule({
    declarations: [
        AboutComponent,
        AddToRepertoireComponent,
        AppComponent,
        AuthenticationComponent,
        BooksListComponent,
        CaretTrackerDirective,
        CreateBookComponent,
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
    entryComponents: [
        AddToRepertoireComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        LayoutModule,
        MatButtonModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
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
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [
        AudioContextProvider,
        GoogleDriveService,
        GoogleDriveTunebookLoaderService,
        PracticeService,
        Recorder,
        RepertoireRepository,
        { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
        TranscriberProvider,
        TuneBookCollectionService,
        TuneBookIndex,
        TuneBookLoaderService,
        TuneMatcherProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
