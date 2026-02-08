import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PdfService } from 'src/app/service/pdf-service';
import { RepertoireRepository } from 'src/app/service/repertoire-repository';
import { csvToArray } from 'src/app/service/tags';
import { TuneBookCollectionService } from 'src/app/service/tunebook-collection.service';
import { GoogleAuthService } from 'src/lib/google-sign-in';
import { TuneBookIndex } from '../../service/tunebook-index';
import { AddToRepertoireComponent, RepertoireSelection } from '../add-to-repertoire/add-to-repertoire.component';


@Component({
    selector: 'app-tune-page',
    templateUrl: './tune-page.component.html',
    standalone: false
})
export class TunePageComponent implements OnInit {
    private index = inject(TuneBookIndex);
    private googleAuth = inject(GoogleAuthService);
    private pdfService = inject(PdfService);
    private route = inject(ActivatedRoute);
    private snackBar = inject(MatSnackBar);
    private dialog = inject(MatDialog);
    private collectionService = inject(TuneBookCollectionService);
    private repertoireRepository = inject(RepertoireRepository);


    tune = '';
    allTags = '';
    signedIn = false;

    prevRef: string;
    nextRef: string;

    private bookId: string;
    private ref: string;

    constructor() {

        this.googleAuth.authState.subscribe(auth => {
            this.signedIn = !!auth;
        });
    }

    ngOnInit() {
        this.route.paramMap.subscribe(map => this.consumeRef(map));
        this.index.tuneBookReady.subscribe(() => {
            this.displayTune(this.bookId, this.ref);
        });
    }

    async save(): Promise<string> {
        const tags = csvToArray(this.allTags);
        const id = await this.collectionService.setTagsForTune(this.ref, this.bookId, tags);
        this.snackBar.open(`Updated tags on Google Drive`, 'Dismiss', { duration: 3000 });
        return id;
    }

    async openDialog(): Promise<void> {
        const dialogRef = this.dialog.open(AddToRepertoireComponent);
        dialogRef.afterClosed().subscribe(added => this.addToRepertoire(added));
    }

    async exportAsPdf(): Promise<void> {
        this.pdfService.saveAsPdf(this.tune);
        this.snackBar.open(`PDF will be displayed in separate window`, 'Dismiss', { duration: 3000 });
    }

    tuneForDisplay(): string {
        return '%%stretchlast\n' + this.tune;
    }

    private async addToRepertoire(selection: RepertoireSelection): Promise<void> {
        if (!selection) {
            return;
        }
        const tuneRef = { bookId: this.bookId, tuneId: this.ref };
        await this.repertoireRepository.addRepertoireItem(tuneRef, selection);
        this.snackBar.open(`Added to repertoire on Google Drive`, 'Dismiss', { duration: 3000 });
    }

    private consumeRef(map: ParamMap): void {
        this.ref = map.get('ref');
        this.bookId = map.get('bookId');
        this.displayTune(this.bookId, this.ref);
    }

    private displayTune(bookId: string, ref: string): void {
        if (ref !== undefined && this.index.isReady()) {
            const entry = this.index.findEntryByTuneReference({ bookId, tuneId: ref });
            if (entry) {
                this.tune = this.index.getAbc(entry);
                if (entry.tags) {
                    this.allTags = entry.tags.join(', ');
                } else {
                    this.allTags = '';
                }
                const book = this.index.getBookById(bookId);
                this.prevRef = undefined;
                this.nextRef = undefined;
                const prevPos = entry.pos - 1;
                if (prevPos >= 0) {
                    this.prevRef = book.tuneBook.tunes[prevPos].id
                }
                const nextPos = entry.pos + 1;
                if (nextPos < book.tuneBook.tunes.length) {
                    this.nextRef = book.tuneBook.tunes[nextPos].id;
                }
            }
        }
    }
}
