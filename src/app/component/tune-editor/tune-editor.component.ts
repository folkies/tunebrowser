import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import abcjs from 'abcjs/midi';
import { GoogleDriveService } from 'src/app/service/google-drive.service';
import { ActivatedRoute } from '@angular/router';
import { TuneBookIndex } from 'src/app/service/tunebook-index';
import { TuneBookReference } from 'src/app/model/tunebook-reference';
import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';

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
        this.renderNotation();
    }

    get tune(): string {
        return this.abc;
    }

    @ViewChild('notation', { static: false })
    div: ElementRef;

    constructor(
        private index: TuneBookIndex,
        private googleDrive: GoogleDriveService,
        private route: ActivatedRoute) {

        this.route.paramMap.subscribe(paramMap => {
            this.bookId = paramMap.get('id');
            this.bookRef = this.index.getBookById(this.bookId);
            this.tune = this.bookRef.abc;
        });
    }

    ngAfterViewInit() {
        this.renderNotation();
    }

    ngOnChanges() {
        this.renderNotation();
    }

    save() {
        this.googleDrive.saveTextFile(this.bookRef.descriptor.path, this.tune);
    }

    private renderNotation(): void {
        if (this.div !== undefined && this.tune.length > 0) {
            abcjs.renderAbc(this.div.nativeElement, this.tune,
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
}
