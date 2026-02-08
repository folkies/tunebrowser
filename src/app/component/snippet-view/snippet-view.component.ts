import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild, NgZone, inject } from '@angular/core';
import abcjs from 'abcjs';
import { extractSnippet } from 'src/app/service/abc-util';

@Component({
    selector: 'app-snippet-view',
    templateUrl: './snippet-view.component.html'
})
export class SnippetViewComponent implements AfterViewInit, OnChanges {
    private zone = inject(NgZone);


    @Input()
    tune = '';

    @ViewChild('snippet', { static: false })
    div: ElementRef;

    private rendered = false;

    ngAfterViewInit() {
        this.renderSnippet();
    }

    ngOnChanges() {
        this.rendered = false;
        this.zone.runOutsideAngular(() => this.renderSnippet());
    }

    private renderSnippet(): void {
        if (this.div !== undefined && this.tune && !this.rendered) {
            const snippet = extractSnippet(this.tune);
            abcjs.renderAbc(this.div.nativeElement, snippet, { scale: 0.8, paddingtop: 0, paddingbottom: 0 });
            this.rendered = true;
        }
    }
}
