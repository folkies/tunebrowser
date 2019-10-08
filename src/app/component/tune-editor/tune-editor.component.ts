import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import abcjs from 'abcjs/midi';

@Component({
    selector: 'app-tune-editor',
    templateUrl: './tune-editor.component.html'
})
export class TuneEditorComponent implements AfterViewInit, OnChanges {

    private abc = '';

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

    constructor() { }

    ngAfterViewInit() {
        this.renderNotation();
    }

    ngOnChanges() {
        this.renderNotation();
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
