import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import abcjs from 'abcjs/midi';

@Component({
    selector: 'app-tune-player',
    templateUrl: './tune-player.component.html'
})
export class TunePlayerComponent implements AfterViewInit, OnChanges {

    /** Beats per minute.  */
    private bpm = 100;

    /** Quarters per minute, computed from bpm based on the time signature of the tune. */
    private qpm = 100;

    private abc = '';

    private parsedTune: abcjs.Tune;

    @ViewChild('midiplayer', { static: false })
    div: ElementRef;

    @Input()
    set tune(tune: string) {
        this.abc = tune;
        this.parsedTune = abcjs.parseOnly(this.tune)[0];
        this.computeQpm();
    }

    get tune(): string {
        return this.abc;
    }

    @Input()
    set tempo(tempo: number) {
        this.bpm = tempo;
        this.computeQpm();
        this.renderMidiPlayer();
    }

    get tempo(): number {
        return this.bpm;
    }

    constructor() { }

    ngAfterViewInit() {
        this.renderMidiPlayer();
    }

    ngOnChanges() {
        this.renderMidiPlayer();
    }

    private renderMidiPlayer(): void {
        if (this.div !== undefined && this.tune.length > 0) {
            abcjs.renderMidi(this.div.nativeElement, this.tune, {
                chordsOff: true,
                program: this.instrumentByName('flute'),
                qpm: this.qpm
            });
        }
    }

    private instrumentByName(name: string): number {
        return abcjs.synth.instrumentIndexToName.indexOf(name.toLowerCase());
    }

    private computeQpm(): void {
        const fraction = this.parsedTune.getMeterFraction();
        if (fraction.den === 2) {
            // the beat is a half note
            this.qpm = 2 * this.bpm;
        }
        else if (fraction.den === 8) {
            if (fraction.num === 3 || fraction.num === 6 || fraction.num === 9 || fraction.num === 12) {
                // the beat is a dotted quarter note
                this.qpm = 3 * this.bpm / 2;
            }
        } else {
            // we assume the beat is a quarter note
            this.qpm = this.bpm;
        }
    }
}
