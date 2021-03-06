import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Recorder } from 'src/app/service/transcription/recorder';

@Component({
    selector: 'record',
    templateUrl: './record.component.html'
})
export class RecordComponent {

    progress: number;

    constructor(
        private router: Router,
        private recorder: Recorder) {

        this.recorder.progress.subscribe(progress =>
            this.progress = progress
        );

        this.recorder.transcriptionResult.subscribe(transcription => {
            this.progress = 0;
            if (!transcription) {
                return;
            }

            this.router.navigate([`/match/${transcription}`])
        });
    }

    async startRecording(): Promise<void> {
        await this.recorder.initAudio();
        this.recorder.start();
    }
}
