import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IndexEntry } from 'src/app/model/index-entry';
import { RepertoireItem } from 'src/app/model/repertoire';
import { PracticeService } from 'src/app/service/practice-service';
import { RepertoireRepository } from 'src/app/service/repertoire-repository';
import { TuneBookIndex } from 'src/app/service/tunebook-index';
import { titleWithoutNumber } from 'src/app/service/abc-util';
import { TranscriberProvider } from 'src/app/service/transcription/transcriber-provider';
import Transcriber from 'src/app/service/transcription/transcriber';
import { Remote } from 'comlink';
import { ITranscriber } from 'src/app/service/transcription/transcription';
import { Recorder } from 'src/app/service/transcription/recorder';
import { Router } from '@angular/router';

/**
 * Builds and displays today's practice assignment for the default repertoire.
 */
@Component({
    selector: 'record',
    templateUrl: './record.component.html'
})
export class RecordComponent implements OnInit {

    progress: number;

    constructor(
        private router: Router,
        private recorder: Recorder) {
        this.recorder.progress.subscribe(progress =>
            this.progress = progress
        );

        this.recorder.transcriptionResult.subscribe(transcription => {
            console.log(`Recording transcribed to ${transcription}`);
            if (!transcription) {
                return;
            }

            this.router.navigate([`/match/${transcription}`])
        });
    }

    ngOnInit(): void {
    }

    async startRecording(): Promise<void> {
        await this.recorder.initAudio();
        this.recorder.start();
    }
}
