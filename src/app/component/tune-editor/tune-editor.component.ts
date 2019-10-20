import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import abcjs, { TuneBook } from 'abcjs/midi';
import { ICaret } from 'src/app/directive/caret-tracker.directive';
import { TuneBookReference } from 'src/app/model/tunebook-reference';
import { GoogleDriveService } from 'src/app/service/google-drive.service';
import { TuneBookIndex } from 'src/app/service/tunebook-index';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-tune-editor',
    templateUrl: './tune-editor.component.html'
})
export class TuneEditorComponent implements AfterViewInit, OnChanges {
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

    constructor(
        private index: TuneBookIndex,
        private googleDrive: GoogleDriveService,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar) {

        this.route.paramMap.subscribe(paramMap => {
            this.bookId = paramMap.get('id');
            this.bookRef = this.index.getBookById(this.bookId);
            this.tune = this.bookRef.abc;
        });
    }

    ngAfterViewInit() {
        this.renderNotation(this.abc);
    }

    ngOnChanges() {
        this.renderNotation(this.abc);
    }

    onCaret(caret: ICaret) {
        console.log(`textPos = ${caret.textPos}`);
        this.renderNotation(this.extractTuneAtCaret(caret.textPos));
    }

    async save() {
        console.log(`saving ${this.bookRef.descriptor.uri}`);
        await this.googleDrive.updateTextFile(this.bookRef.descriptor.uri, this.tune);
        this.bookRef.abc = this.tune;
        this.bookRef.tuneBook = new TuneBook(this.tune);
        this.index.updateTuneBook(this.bookRef);
        this.snackBar.open(`Updated ${this.bookRef.descriptor.name} on Google Drive`, 'Dismiss', { duration: 3000 });
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
