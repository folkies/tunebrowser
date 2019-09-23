import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import abcjs from 'abcjs';

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
            abcjs.renderAbc(this.div.nativeElement, this.tune,
                {
                    paddingleft: 0,
                    paddingright: 0,
                    paddingtop: 0,
                    paddingbottom: 0,
                });
        }
    }
}
