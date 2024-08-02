import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { Recorder } from 'src/app/service/transcription/recorder';

@Component({
    selector: 'app-record',
    templateUrl: './record.component.html'
})
export class RecordComponent {

    progress: number;
    progressbarValue: number;

    constructor(
        private router: Router,
        private recorder: Recorder) {

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
