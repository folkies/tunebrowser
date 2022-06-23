import { FuzzyHistogram } from './fuzzy-histogram';
import { PitchDetector } from './pitch-detector';
import { PitchSpeller } from './pitch-speller';
import { TranscriptionInitParams } from './transcription';

const DEFAULT_SAMPLE_RATE = 22050;
const DEFAULT_SAMPLE_TIME = 12;
const DEFAULT_BLANK_TIME = 2;
const DEFAULT_FUNDAMENTAL = 'D';

export interface Note {
    spelling: string;
    onset: number;
    duration?: number;
    frequency: number;
    qq?: number;
}

export interface TranscriptionResult {
    transcription: string;
    sampleRate?: number;
    numSamples?: number;
}

export default class FftTranscriber {
    readonly inputSampleRate: number;
    readonly outputSampleRate: number;
    readonly numInputSamples: number;
    readonly numOutputSamples: number;

    private sampleTime: number;
    private blankTime: number;
    private fundamental: string;
    private enableSampleRateConversion: boolean;

    private frameSize: number;

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

        if (this.enableSampleRateConversion) {
            this.outputSampleRate = DEFAULT_SAMPLE_RATE;
        }
        else {
            this.outputSampleRate = this.inputSampleRate;
        }

        this.numInputSamples = this.inputSampleRate * (this.blankTime + this.sampleTime);
        this.numOutputSamples = this.outputSampleRate * (this.blankTime + this.sampleTime);

        this.frameSize = typeof params.frameSize !== 'undefined'
            ? params.frameSize
            : this.calcFrameSize(this.outputSampleRate);
    }

    transcribe(spectra: Float32Array[]): string {

        const speller = new PitchSpeller(this.fundamental);
        const notes: Note[] = [];
        let lastNote = '';

        let onset = 0;
        for (const spectrum of spectra) {
            const linear = spectrum.map(db => this.decibelToLinear(db));
            const frequency = PitchDetector.mikelsFrequency(Array.from(linear), this.outputSampleRate, this.frameSize);
            console.log(frequency)

            const currentNote = speller.spellFrequency(frequency);

            if (currentNote != lastNote) {
                lastNote = currentNote;
                const note = {
                    spelling: currentNote,
                    frequency: frequency,
                    onset: onset,
                };
                notes.push(note);
            }
            onset += (20/1000);
        }

        const transcription = this.postProcess(notes, false);
        return transcription;
    }

    private postProcess(notes: Note[], midi: boolean): string {
        let transcription = '';

        for (let i = 0; i < notes.length - 1; i++) {
            notes[i].duration = notes[i + 1].onset - notes[i].onset;
            if (notes[i].duration < 0) console.log(notes[i + 1].onset, notes[i].onset);
        }

        notes.slice(-1)[0].duration = this.blankTime + this.sampleTime - notes.slice(-1)[0].onset;

        const durations = new Array(notes.length);
        for (let i = 0; i < notes.length; i++) {
            durations[i] = notes[i].duration;
        }

        const quaverLength = FuzzyHistogram.calculatePeak(durations, 0.33, 0.1);

        for (const note of notes) {
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

    private decibelToLinear(db: number): number {
        return Math.pow(10, db/20);
    }
}
