import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import abcjs from 'abcjs/midi';
import { extractSnippet } from 'src/app/service/abc-util';

@Component({
    selector: 'app-snippet-view',
    templateUrl: './snippet-view.component.html'
})
export class SnippetViewComponent implements AfterViewInit, OnChanges {

    @Input()
    tune = '';

    @ViewChild('snippet', { static: false })
    div: ElementRef;

    private rendered = false;

    constructor() { }

    ngAfterViewInit() {
        this.renderSnippet();
    }

    ngOnChanges() {
        this.rendered = false;
        this.renderSnippet();
    }

    private renderSnippet(): void {
        if (this.div !== undefined && this.tune && !this.rendered) {
            const snippet = extractSnippet(this.tune);
            abcjs.renderAbc(this.div.nativeElement, snippet, { scale: 0.8, paddingtop: 0, paddingbottom: 0 });
            this.rendered = true;
        }
    }
}
