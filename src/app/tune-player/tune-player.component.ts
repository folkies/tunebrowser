import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import abcjs from 'abcjs/midi';

@Component({
    selector: 'app-tune-player',
    templateUrl: './tune-player.component.html'
})
export class TunePlayerComponent implements AfterViewInit, OnChanges {

    @Input()
    tune = '';

    @ViewChild('midiplayer', { static: false })
    div: ElementRef;

    constructor() { }

    ngAfterViewInit() {
        this.renderMidiPlayer();
    }

    ngOnChanges() {
        this.renderMidiPlayer();
    }

    private renderMidiPlayer(): void {
        if (this.div !== undefined && this.tune.length > 0) {
            abcjs.renderMidi(this.div.nativeElement, this.tune, { chordsOff: true });
        }
    }
}
