import { Injectable, NgZone } from '@angular/core';
import { Remote } from 'comlink';
import { BehaviorSubject, Observable, Subject, Subscription, timer } from 'rxjs';
import { AudioContextProvider } from './audio-context-provider';
import { TranscriberProvider } from './transcriber-provider';
import { ITranscriber, TranscriptionInitParams, TranscriptionResult } from './transcription';

/* Ticks in seconds for taking spectrum samples. */
const DEFAULT_TICK_TIME = 0.01;

/* Size of FFT buffer. */
const DEFAULT_BUFFER_SIZE = 4096;

@Injectable()
export class Recorder {
    private status: Status;
    private audioContext: AudioContext;
    private timeRecorded = 0;
    private transcriber: Remote<ITranscriber>;
    private stream: MediaStream;
    private input: MediaStreamAudioSourceNode;
    private tickTime = DEFAULT_TICK_TIME;
    private analyser: AnalyserNode;
    private timer: Observable<number>;
    private subscription: Subscription;
    private fftBuffer: Float32Array<ArrayBuffer>;

    private progressSource = new BehaviorSubject<number>(0);
    private transcriptionResultSource = new Subject<string>();

    analysisProgress: number;
    progress: Observable<number> = this.progressSource.asObservable();
    transcriptionResult: Observable<string> = this.transcriptionResultSource.asObservable();
    


    get sampleTime() { return 12; }

    get blankTime() { return 0; }

    get fundamental() { return 'D'; }

    get sampleRate() { return this.audioContext.sampleRate; }
    get progressPercentage() { return 100 * this.timeRecorded / (this.blankTime + this.sampleTime); }

    constructor(
        private audioContextProvider: AudioContextProvider,
        private transcriberProvider: TranscriberProvider,
        private zone: NgZone) {
        this.transcriber = this.transcriberProvider.transcriber();

        this.status = Status.STOPPED;
    }

    private onTranscribed(result: TranscriptionResult): void {
        this.zone.run(() =>
            this.transcriptionResultSource.next(result.transcription));
    }

    async initAudio(): Promise<void> {
        this.audioContext = await this.audioContextProvider.audioContext();

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (this.stream) {
                this.status = Status.INIT_SUCCEEDED;
                const bufferSize = DEFAULT_BUFFER_SIZE;

                this.input = this.audioContext.createMediaStreamSource(this.stream);
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = bufferSize;
                this.input.connect(this.analyser);
            }
        }
        catch (_) {
            this.status = Status.INIT_FAILED;
        }
    }

    start() {
        if (!this.stream) {
            return;
        }

        const initParams: TranscriptionInitParams = {
            inputSampleRate: this.audioContext.sampleRate,
            sampleTime: this.sampleTime,
            blankTime: this.blankTime,
            tickTime: this.tickTime,
            fundamental: this.fundamental
        };

        this.transcriber.initialize(initParams)
            .then(() => this.status = Status.RECORDING);

        this.fftBuffer = new Float32Array(this.analyser.frequencyBinCount);
        this.timer = timer(0, this.tickTime * 1000);
        this.subscription = this.timer.subscribe(() => this.pushSpectrum());
    }

    private async pushSpectrum(): Promise<void> {
        if (this.status != Status.RECORDING) {
            return;
        }

        this.analyser.getFloatFrequencyData(this.fftBuffer);
        this.transcriber.pushSignal(this.fftBuffer)
        this.timeRecorded += this.tickTime;

        this.zone.run(() =>
            this.progressSource.next(this.progressPercentage));

        if (this.recordingComplete()) {
            this.subscription.unsubscribe();
            await this.analyzeSignal();
        }
    }

    private recordingComplete(): boolean {
        return this.timeRecorded >= this.sampleTime;
    }

    stop() {
        this.status = Status.STOPPED;
        this.timeRecorded = 0;
        if (this.stream) { 
            this.stream.getTracks().forEach(t => t.stop());
            // This is needed to turn off the recording symbol in the browser
            this.stream = null;
        }
        this.input.disconnect(this.analyser);
    }

    destroy() {
        this.stop();
    }

    private async analyzeSignal(): Promise<void> {
        this.stop();
        this.status = Status.ANALYZING;

        const result = await this.transcriber.transcribe();
        this.status = Status.ANALYSIS_SUCCEEDED;
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
