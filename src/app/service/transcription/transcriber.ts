import { DSP, FFT, WindowFunction } from 'src/lib/dsp';
import { FuzzyHistogram } from './fuzzy-histogram';
import { PitchDetector } from './pitch-detector';
import { PitchSpeller } from './pitch-speller';
import { TranscriptionInitParams } from './transcription';

const DEFAULT_SAMPLE_RATE = 22050;
const DEFAULT_SAMPLE_TIME = 12;
const DEFAULT_BLANK_TIME = 2;
const DEFAULT_FUNDAMENTAL = 'D';
const DEFAULT_FRAME_SIZE = 'auto';
const OVERLAP = 0.75;

export interface Note {
    spelling: string;
    onset: number;
    duration?: number;
    frequency: number;
    qq?: number;
}

export interface TranscriptionResult {
    transcription: string;
    sampleRate: number;
    numSamples: number;
}

export default class Transcriber {
    readonly inputSampleRate: number;
    readonly outputSampleRate: number;
    readonly numInputSamples: number;
    readonly numOutputSamples: number;

    private sampleTime: number;
    private blankTime: number;
    private fundamental: string;
    private enableSampleRateConversion: boolean;
    private progress: number;
    private interrupted: boolean;
    private signal: Float32Array;

    private frameSize: any;
    private hopSize: number;
    private windowFunction: WindowFunction;
    private powerSpectrum: FFT;

    private onProgress: (x: number) => void;

    constructor(params: TranscriptionInitParams) {
        this.inputSampleRate = typeof params.inputSampleRate !== 'undefined'
            ? params.inputSampleRate
            : DEFAULT_SAMPLE_RATE;

        this.sampleTime = typeof params.sampleTime !== 'undefined'
            ? params.sampleTime
            : DEFAULT_SAMPLE_TIME;

        this.blankTime = typeof params.blankTime !== 'undefined'
            ? params.blankTime
            : DEFAULT_BLANK_TIME;

        this.fundamental = typeof params.fundamental !== 'undefined'
            ? params.fundamental
            : DEFAULT_FUNDAMENTAL;

        this.enableSampleRateConversion = typeof params.enableSampleRateConversion !== 'undefined'
            ? params.enableSampleRateConversion
            : false;

        this.frameSize = typeof params.frameSize !== 'undefined'
            ? params.frameSize
            : DEFAULT_FRAME_SIZE;

        this.onProgress = typeof params.onProgress !== 'undefined'
            ? params.onProgress
            : (x: number) => { };

        if (this.enableSampleRateConversion) {
            this.outputSampleRate = DEFAULT_SAMPLE_RATE;
        }
        else {
            this.outputSampleRate = this.inputSampleRate;
        }

        this.numInputSamples = this.inputSampleRate * (this.blankTime + this.sampleTime);
        this.numOutputSamples = this.outputSampleRate * (this.blankTime + this.sampleTime);

        if (this.frameSize === 'auto') {
            this.frameSize = this.calcFrameSize(this.outputSampleRate);
        }

        this.hopSize = this.frameSize * (1 - OVERLAP);

        console.log('Frame size and hop size:', this.frameSize, this.hopSize);

        this.windowFunction = new WindowFunction(DSP.HANN);
        this.powerSpectrum = new FFT(this.frameSize, this.outputSampleRate);
    }

    transcribe(signal: Float32Array, midi = false): string {
        if (this.enableSampleRateConversion) {
            this.signal = this.convertSampleRate(signal);
        }
        else {
            this.signal = signal;
        }

        let speller = new PitchSpeller(this.fundamental);
        let numHops = Math.floor((this.outputSampleRate * this.sampleTime - this.frameSize) / this.hopSize) + 1;
        let notes: Note[] = [];
        let lastNote = '';
        const numBlankSamples = this.blankTime * this.outputSampleRate;

        for (let i = 0; i < numHops; i++) {
            if (this.interrupted) {
                return '';
            }

            let startAt = numBlankSamples + this.hopSize * i;
            this.progress = i / numHops;
            this.onProgress(this.progress);

            let frame = this.signal.slice(startAt, startAt + this.frameSize);
            
            // skip last frame if it is too short
            if (frame.length != this.frameSize) {
                continue;
            }

            this.windowFunction.process(frame);
            let spectrum = this.powerSpectrum.forward(frame);

            let frequency = PitchDetector.mikelsFrequency(spectrum, this.outputSampleRate, this.frameSize);

            let currentNote = midi
                ? speller.spellFrequencyAsMidi(frequency)
                : speller.spellFrequency(frequency);

            if (currentNote != lastNote) {
                lastNote = currentNote;
                let note = {
                    spelling: currentNote,
                    frequency: frequency,
                    onset: startAt / this.outputSampleRate,
                };
                notes.push(note);
            }
        }

        let transcription = this.postProcess(notes, midi);
        return transcription;
    }

    private convertSampleRate(inSignal: Float32Array): Float32Array {
        let outSignal = new Float32Array(this.numOutputSamples);
        let end = 0;

        for (let i = 0; i < outSignal.length; i++) {
            //TODO: smooth interpolation
            let begin = end;
            end = Math.floor((i + 1) * this.inputSampleRate / this.outputSampleRate);
            let sum = 0;

            for (let j = begin; j < end; j++) {
                sum += inSignal[j];
            }

            outSignal[i] = sum / (end - begin);
        }

        return outSignal;
    }

    private postProcess(notes: Note[], midi: boolean): string {
        let transcription = '';

        for (let i = 0; i < notes.length - 1; i++) {
            notes[i].duration = notes[i + 1].onset - notes[i].onset;
            if (notes[i].duration < 0) console.log(notes[i + 1].onset, notes[i].onset);
        }

        notes.slice(-1)[0].duration = this.blankTime + this.sampleTime - notes.slice(-1)[0].onset;

        let durations = new Array(notes.length);
        for (let i = 0; i < notes.length; i++) {
            durations[i] = notes[i].duration;
        }

        let quaverLength = FuzzyHistogram.calculatePeak(durations, 0.33, 0.1);

        for (let note of notes) {
            if (note.spelling == 'Z') continue;

            note.qq = Math.round(note.duration / quaverLength);

            let spelling = note.spelling;
            if (midi) spelling += ',';
            spelling = spelling.repeat(note.qq);

            transcription += spelling;
        }

        return transcription;
    }

    private calcFrameSize(sampleRate: number): number {
        const idealFrameSize = sampleRate / 10;
        const prev = this.prevPow2(idealFrameSize);
        const next = prev * 2;
        return next - idealFrameSize < prev - idealFrameSize ? next : prev;
    }

    private prevPow2(v: number): number {
        return Math.pow(2, Math.floor(Math.log(v) / Math.log(2)));
    }

}
