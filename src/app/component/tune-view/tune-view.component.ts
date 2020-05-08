import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import abcjs from 'abcjs/midi';

@Component({
    selector: 'app-tune-view',
    templateUrl: './tune-view.component.html'
})
export class TuneViewComponent implements AfterViewInit, OnChanges {

    @Input()
    tune = '';

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
            abcjs.renderAbc(
                this.div.nativeElement,
                this.includeNumberInTitle(this.tune),
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

    private includeNumberInTitle(abc: string): string {
        const match = abc.match(/^T:(\s*)(\d+[a-z]?\s*)/m);
        if (match) {
            return abc;
        }
        const idMatch = abc.match(/^X:(\s*)(\w+)/m);
        if (!idMatch) {
            return;
        }
        const id = idMatch[2];
        const titleMatch = abc.match(/^T:(\s*)(.+?)(, The)?$/m);
        const title = titleMatch[2];
        const article = titleMatch[3] ? 'The ' : '';
        return abc.replace(titleMatch[0], `T: ${id} ${article}${title}`);
    }
}
