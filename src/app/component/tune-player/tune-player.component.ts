import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import abcjs from 'abcjs/midi';

@Component({
    selector: 'app-tune-player',
    templateUrl: './tune-player.component.html'
})
export class TunePlayerComponent implements AfterViewInit, OnChanges {

    private bpm = 100;

    @ViewChild('midiplayer', { static: false })
    div: ElementRef;

    @Input()
    tune = '';

    @Input()
    set tempo(tempo: number) {
        this.bpm = tempo;
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
                qpm: this.tempo
            });
        }
    }

    private instrumentByName(name: string): number {
        return abcjs.synth.instrumentIndexToName.indexOf(name.toLowerCase());
    }
}
