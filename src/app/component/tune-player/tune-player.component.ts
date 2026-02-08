import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';

import abcjs from 'abcjs';
import { asyncScheduler, BehaviorSubject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';


@Component({
    selector: 'app-tune-player',
    templateUrl: './tune-player.component.html'
})
export class TunePlayerComponent implements AfterViewInit, OnChanges {

    /** Beats per minute.  */
    private bpm = 100;

    private abc = '';

    private parsedTune: abcjs.TuneObject;
    private synthControl: abcjs.SynthObjectController;

    private tempoSource = new BehaviorSubject<number>(100);


    @ViewChild('midiplayer', { static: true })
    div: ElementRef;

    @Input()
    set tune(tune: string) {
        this.abc = tune;
        this.parsedTune = abcjs.renderAbc("*", this.abc)[0]
    }

    get tune(): string {
        return this.abc;
    }

    @Input()
    set tempo(tempo: number) {
        this.bpm = tempo;
        this.tempoSource.next(tempo);
    }

    get tempo(): number {
        return this.bpm;
    }

    constructor() {
        this.synthControl = new abcjs.synth.SynthController();
        this.tempoSource.pipe(throttleTime(500, asyncScheduler, {trailing: true})).subscribe( tempo => {
            this.synthControl.setWarp(tempo);
        })
    }


    ngAfterViewInit() {
        this.renderMidiPlayer();
    }

    ngOnChanges() {
       this.renderMidiPlayer();
    }

    private async renderMidiPlayer(): Promise<abcjs.SynthInitResponse> {
        if (this.div !== undefined && this.tune.length > 0) {

            console.log("reload player");
            this.synthControl.load(this.div.nativeElement,
                null,
                {
                    displayLoop: true,
                    displayRestart: true,
                    displayPlay: true,
                    displayProgress: true,
                    // hidden via CSS, but we need it here to make setWarp() work
                    displayWarp: true
                }
            );
            // ugly hack for setting the tempo, since the audioParams seem to have no effect
            this.parsedTune.metaText.tempo = {bpm: this.bpm, startChar: 0, endChar: 0};
            return this.synthControl.setTune(this.parsedTune, true, {
                chordsOff: true, 
                program: this.instrumentByName('flute')
            });
        }
    }

    private instrumentByName(name: string): number {
        return abcjs.synth.instrumentIndexToName.indexOf(name.toLowerCase());
    }
}
