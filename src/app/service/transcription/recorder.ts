import { Injectable, NgZone } from '@angular/core';
import { Remote } from 'comlink';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AudioContextProvider } from './audio-context-provider';
import { TranscriberProvider } from './transcriber-provider';
import { ITranscriber, TranscriptionInitParams, TranscriptionResult } from './transcription';

@Injectable()
export class Recorder {
    private _status: Status;
    private _audioContext: AudioContext;
    private _amplitude: number;
    private _timeRecorded: number;
    private _processor: ScriptProcessorNode;
    private _transcriber: Remote<ITranscriber>;
    private _stream: MediaStream;
    private _input: MediaStreamAudioSourceNode;
    private _transcription: string;
    private _signal: Float32Array;

    analysisProgress: number;

    private progressSource = new BehaviorSubject<number>(0);
    private transcriptionResultSource = new Subject<string>();

    progress: Observable<number> = this.progressSource.asObservable();
    transcriptionResult: Observable<string> = this.transcriptionResultSource.asObservable();


    get sampleTime() { return 12; }

    get blankTime() { return 0; }

    get fundamental() { return 'D'; }

    get enableSampleRateConversion() { return false; }

    get transcriberFrameSize() { return 'auto'; }

    get audioContext() { return this._audioContext; }
    get sampleRate() { return this._audioContext.sampleRate; }
    get amplitude() { return this._amplitude; }
    get timeRecorded() { return this._timeRecorded; }
    get transcription() { return this._transcription; }
    get progressPercentage() { return 100 * this._timeRecorded / (this.blankTime + this.sampleTime); }
    get numSamples() { return this._audioContext.sampleRate * this.sampleTime; }
    get status() { return this._status; }
    get signal() { return this._signal; }

    constructor(
        private audioContextProvider: AudioContextProvider,
        private transcriberProvider: TranscriberProvider,
        private zone: NgZone) {
        this._transcriber = this.transcriberProvider.transcriber();

        this._status = Status.STOPPED;
    }

    private onTranscribed(result: TranscriptionResult): void {
        this.zone.run(() =>
            this.transcriptionResultSource.next(result.transcription));
    }

    async initAudio(): Promise<void> {
        this._audioContext = await this.audioContextProvider.audioContext();

        try {
            this._stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (this._stream) {
                this._status = Status.INIT_SUCCEEDED;
                const bufferSize = 4096;

                this._input = this._audioContext.createMediaStreamSource(this._stream);
                this._processor = this._audioContext.createScriptProcessor(bufferSize, 1, 1);

                this._processor.onaudioprocess = e => this.update(e);

                this._input.connect(this._processor);
                this._processor.connect(this._audioContext.destination);
            }
        }
        catch (err) {
            this._status = Status.INIT_FAILED;
        }
    }

    close() {
        //this.stop();
    }

    start() {
        if (!this._stream) return;

        const initParams: TranscriptionInitParams = {
            inputSampleRate: this._audioContext.sampleRate,
            sampleTime: this.sampleTime,
            blankTime: this.blankTime,
            fundamental: this.fundamental,
            enableSampleRateConversion: this.enableSampleRateConversion,
        };

        this._transcriber.initialize(initParams)
            .then(() => this._status = Status.RECORDING);
    }

    stop() {
        this._status = Status.STOPPED;
        this._amplitude = 0;
        this._timeRecorded = 0;
        if (this._stream) { 
            this._stream.getTracks().forEach(t => t.stop());
            // This is needed to turn of the recording symbol in the browser
            this._stream = null;
        }
        this._processor.disconnect(this._audioContext.destination);
        this._input.disconnect(this._processor);
    }

    destroy() {
        this.stop();
        this._stream = null;
    }

    private async update(e: AudioProcessingEvent): Promise<void> {
        if (this._status != Status.RECORDING) {
            return;
        }

        const audio = e.inputBuffer;
        const signalBuffer = audio.getChannelData(0);

        const msg = await this._transcriber.pushSignal(signalBuffer)
        this._amplitude = msg.amplitude;
        this._timeRecorded = msg.timeRecorded;

        this.zone.run(() =>
            this.progressSource.next(this.progressPercentage));

        if (msg.isBufferFull) {
            await this.analyzeSignal();
        }
    }

    private async analyzeSignal(): Promise<void> {
        this.stop();
        this._status = Status.ANALYZING;

        const result = await this._transcriber.transcribe();
        this._status = Status.ANALYSIS_SUCCEEDED;
        this.onTranscribed(result);
    }
}

export enum Status {
    STOPPED = 'STOPPED',
    INIT = 'INIT',
    INIT_SUCCEEDED = 'INIT_SUCCEEDED',
    INIT_FAILED = 'INIT_FAILED',
    RECORDING = 'RECORDING',
    ANALYZING = 'ANALYZING',
    ANALYSIS_SUCCEEDED = 'ANALYSIS_SUCCEEDED',
    API_MISSING = 'API_MISSING',
}
