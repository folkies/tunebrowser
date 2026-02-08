import { AfterViewInit, Component, ElementRef, Input, ViewChild, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import abcjs, { TuneBook } from 'abcjs';
import { ICaret } from 'src/app/directive/caret-tracker.directive';
import { TuneBookReference } from 'src/app/model/tunebook-reference';
import { GoogleDriveService } from 'src/app/service/google-drive.service';
import { PdfService } from 'src/app/service/pdf-service';
import { TuneBookCollectionService } from 'src/app/service/tunebook-collection.service';
import { TuneBookIndex } from 'src/app/service/tunebook-index';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CaretTrackerDirective } from '../../directive/caret-tracker.directive';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-tune-editor',
    templateUrl: './tune-editor.component.html',
    imports: [FormsModule, MatFormField, MatInput, CaretTrackerDirective, MatButton, MatIcon]
})
export class TuneEditorComponent implements AfterViewInit {
    private index = inject(TuneBookIndex);
    private collectionService = inject(TuneBookCollectionService);
    private googleDrive = inject(GoogleDriveService);
    private pdfService = inject(PdfService);
    private route = inject(ActivatedRoute);
    private snackBar = inject(MatSnackBar);

    private abc = '';
    private bookId: string;
    private bookRef: TuneBookReference;

    @Input()
    set tune(abc: string) {
        this.abc = abc;
    }

    get tune(): string {
        return this.abc;
    }

    @ViewChild('notation', { static: false })
    div: ElementRef;

    constructor() {

        this.route.paramMap.subscribe(paramMap => {
            this.bookId = paramMap.get('id');
            this.bookRef = this.index.getBookById(this.bookId);
            this.tune = this.bookRef.abc;
        });

        this.index.tuneBookReady.subscribe(id => {
            if (id === this.bookId) {
                this.bookRef = this.index.getBookById(this.bookId);
                this.tune = this.bookRef.abc;
                this.renderNotation(this.abc);
            }
        });
    }

    ngAfterViewInit() {
        this.renderNotation(this.abc);
    }

    onCaret(caret: ICaret) {
        this.renderNotation(this.extractTuneAtCaret(caret.textPos));
    }

    async save(): Promise<void> {
        await this.googleDrive.updateTextFile(this.bookRef.descriptor.uri, this.tune);
        this.bookRef.abc = this.tune;
        this.bookRef.tuneBook = new TuneBook(this.tune);
        this.index.updateTuneBook(this.bookRef);
        this.snackBar.open(`Updated ${this.bookRef.descriptor.name} on Google Drive`, 'Dismiss', { duration: 3000 });
    }

    async delete(): Promise<void> {
        await this.collectionService.removeBook(this.bookId);
        this.snackBar.open(`Removed ${this.bookRef.descriptor.name} from collection`, 'Dismiss', { duration: 3000 });
    }

    async exportAsPdf(): Promise<void> {
        this.pdfService.saveAsPdf(this.tune);
        this.snackBar.open(`PDF will be displayed in separate window`, 'Dismiss', { duration: 3000 });
    }

    private renderNotation(abc: string): void {
        if (this.div !== undefined && abc.length > 0) {
            abcjs.renderAbc(this.div.nativeElement, abc,
                {
                    paddingleft: 0,
                    paddingright: 0,
                    paddingtop: 0,
                    paddingbottom: 0,
                    staffwidth: 1000,
                    responsive: 'resize'
                });
        }
    }

    private extractTuneAtCaret(pos: number): string {
        const start = Math.max(0, this.abc.lastIndexOf('X:', pos));
        let end = this.abc.indexOf('X:', start + 2);
        if (end === -1) {
            end = this.abc.length;
        }
        return this.abc.substring(start, end);
    }
}
