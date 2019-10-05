import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import abcjs from 'abcjs/midi';

@Component({
    selector: 'app-snippet-view',
    templateUrl: './snippet-view.component.html'
})
export class SnippetViewComponent implements AfterViewInit, OnChanges {

    @Input()
    tune = '';

    @ViewChild('snippet', { static: false })
    div: ElementRef;

    constructor() { }

    ngAfterViewInit() {
        this.renderSnippet();
    }

    ngOnChanges() {
        this.renderSnippet();
    }

    private renderSnippet(): void {
        if (this.div !== undefined && this.tune) {
            const snippet = this.buildSnippet(this.tune);
            abcjs.renderAbc(this.div.nativeElement, snippet, { scale: 0.8, paddingtop: 0, paddingbottom: 0 });
        }
    }

    private buildSnippet(abc: string): string {
        const lines = abc.split('\n');
        const filteredLines = [];
        let musicSeen = false;
        for (const line of lines) {
            if (/^[A-Za-z]:/.test(line)) {
                if (/^[XMLK]:/.test(line)) {
                    filteredLines.push(line);
                }
            } else {
                if (musicSeen) {
                    break;
                }
                const bars = line.split('|');
                if (bars.length > 1) {
                    musicSeen = true;
                    filteredLines.push(bars.slice(0, 3).join('|'));
                }
            }
        }
        return filteredLines.join('\n');
    }
}
