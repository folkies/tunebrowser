import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GoogleDriveService } from 'src/app/service/google-drive.service';
import { RepertoireRepository } from 'src/app/service/repertoire-repository';
import { csvToArray } from 'src/app/service/tags';
import { TuneBookCollectionService } from 'src/app/service/tunebook-collection.service';
import { TuneBookIndex } from '../../service/tunebook-index';
import { AddToRepertoireComponent } from '../add-to-repertoire/add-to-repertoire.component';
import { PdfService } from 'src/app/service/pdf-service';


@Component({
    selector: 'app-tune-page',
    templateUrl: './tune-page.component.html'
})
export class TunePageComponent implements OnInit {

    tune = '';
    allTags = '';

    private bookId: string;
    private ref: string;

    constructor(
        private index: TuneBookIndex,
        private googleDriveService: GoogleDriveService,
        private pdfService: PdfService,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private collectionService: TuneBookCollectionService,
        private repertoireRepository: RepertoireRepository) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(map => this.consumeRef(map));
        this.index.tuneBookReady.subscribe(() => {
            this.displayTune(this.bookId, this.ref);
        });
    }

    get signedOut(): boolean {
        return this.googleDriveService.isSignedOut();
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
    }

    tuneForDisplay(): string {
        return '%%stretchlast\n' + this.tune;
    }

    private async addToRepertoire(added: Date): Promise<void> {
        if (!added) {
            return;
        }
        const tuneRef = { bookId: this.bookId, tuneId: this.ref };
        await this.repertoireRepository.addRepertoireItem(tuneRef, added);
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
                }
            }
        }
    }
}
