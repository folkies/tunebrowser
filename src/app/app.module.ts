import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog'; 
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AboutComponent } from './component/about/about.component';
import { AuthenticationComponent } from './component/authentication/authentication.component';
import { BooksListComponent } from './component/books-list/books-list.component';
import { CreateBookComponent } from './component/create-book/create-book.component';
import { SearchComponent } from './component/search/search.component';
import { SnippetViewComponent } from './component/snippet-view/snippet-view.component';
import { TuneEditorComponent } from './component/tune-editor/tune-editor.component';
import { TunePageComponent } from './component/tune-page/tune-page.component';
import { AddToRepertoireComponent } from './component/tune-page/add-to-repertoire.component';
import { TunePlayerComponent } from './component/tune-player/tune-player.component';
import { TuneViewComponent } from './component/tune-view/tune-view.component';
import { TunesListComponent } from './component/tunes-list/tunes-list.component';
import { CaretTrackerDirective } from './directive/caret-tracker.directive';
import { GoogleDriveTunebookLoaderService } from './service/google-drive-tunebook-loader.service';
import { GoogleDriveService } from './service/google-drive.service';
import { TuneBookCollectionService } from './service/tunebook-collection.service';
import { TuneBookIndex } from './service/tunebook-index';
import { TuneBookLoaderService } from './service/tunebook-loader.service';
import { PracticeService } from './service/practice-service';
import { RepertoireRepository } from './service/repertoire-repository';
import { PracticeComponent } from './component/practice/practice.component';

const appRoutes: Routes = [
    { path: 'about', component: AboutComponent },
    { path: 'books', component: BooksListComponent },
    { path: 'createBook', component: CreateBookComponent },
    { path: 'edit/:id', component: TuneEditorComponent },
    { path: 'book/:id', component: TunesListComponent },
    { path: 'login', component: AuthenticationComponent },
    { path: 'logout', component: AuthenticationComponent },
    { path: 'practice', component: PracticeComponent },
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
        PracticeComponent,
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
        MatButtonModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSnackBarModule,
        MatToolbarModule,
        RouterModule.forRoot(appRoutes),
        ScrollingModule
    ],
    providers: [
        GoogleDriveService,
        GoogleDriveTunebookLoaderService,
        PracticeService,
        RepertoireRepository,
        TuneBookCollectionService,
        TuneBookIndex,
        TuneBookLoaderService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
