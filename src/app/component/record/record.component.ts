import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { Recorder } from 'src/app/service/transcription/recorder';

@Component({
    selector: 'app-record',
    templateUrl: './record.component.html',
    standalone: false
})
export class RecordComponent {
    private router = inject(Router);
    private recorder = inject(Recorder);


    progress: number;
    progressbarValue: number;

    constructor() {

        // using this.progress directly in mat-progress-bar does not work in Firefox
        this.recorder.progress.subscribe(progress => this.progress = progress);

        this.recorder.transcriptionResult.subscribe(transcription => {
            this.progress = 0;
            this.progressbarValue = 0;
            if (!transcription) {
                return;
            }

            this.router.navigate([`/match/${transcription}`])
        });
    }


    async startRecording() {
        const timer = interval(100);

        const sub = timer.subscribe((_) => {
            this.progressbarValue = this.progress;

            if (this.progressbarValue >= 100) {
                sub.unsubscribe();
            }
        });

        await this.recorder.initAudio();
        this.recorder.start();
    }
}
