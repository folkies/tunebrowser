import { FuzzyHistogram } from './fuzzy-histogram';
import { PitchDetector } from './pitch-detector';
import { PitchSpeller } from './pitch-speller';
import { TranscriptionInitParams } from './transcription';

const DEFAULT_SAMPLE_RATE = 44100;
const DEFAULT_FRAME_SIZE = 4096;
const DEFAULT_SAMPLE_TIME = 12;
const DEFAULT_BLANK_TIME = 0;
const DEFAULT_TICK_TIME = 20/1000;
const DEFAULT_FUNDAMENTAL = 'D';

export interface Note {
    spelling: string;
    onset: number;
    duration?: number;
    frequency: number;
    quavers?: number;
}

export default class Transcriber {
    private inputSampleRate: number;

    private sampleTime: number;
    private blankTime: number;
    private tickTime: number;
    private fundamental: string;
    private frameSize: number;

    constructor(params: TranscriptionInitParams) {
        this.inputSampleRate = params.inputSampleRate || DEFAULT_SAMPLE_RATE;
        this.sampleTime = params.sampleTime || DEFAULT_SAMPLE_TIME;
        this.blankTime = params.blankTime || DEFAULT_BLANK_TIME;
        this.tickTime = params.tickTime || DEFAULT_TICK_TIME;
        this.fundamental = params.fundamental || DEFAULT_FUNDAMENTAL;
        this.frameSize = params.frameSize || DEFAULT_FRAME_SIZE;
    }

    transcribe(spectra: Float32Array[]): string {

        const speller = new PitchSpeller(this.fundamental);
        const notes: Note[] = [];
        let lastNote = '';

        let onset = 0;
        for (const spectrum of spectra) {
            const linear = spectrum.map(db => this.decibelToLinear(db));
            const frequency = PitchDetector.mikelsFrequency(Array.from(linear), this.inputSampleRate, this.frameSize);

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
            onset += this.tickTime;
        }

        const transcription = this.postProcess(notes);
        return transcription;
    }

    private postProcess(notes: Note[]): string {
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

            note.quavers = Math.round(note.duration / quaverLength);

            let spelling = note.spelling;
            spelling = spelling.repeat(note.quavers);

            transcription += spelling;
        }

        return transcription;
    }

    private decibelToLinear(db: number): number {
        return Math.pow(10, db/20);
    }
}
