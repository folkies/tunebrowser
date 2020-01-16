const RATIO = 1.05946309436;
const RATIO_SQUARED = RATIO * RATIO;
const ABC_NOTE_RANGE = 33;
const MIDI_NOTE_RANGE = 87;
const MIDI_OFFSET = 21;

const NOTE_NAMES = [
    'D', 'E', 'F', 'G', 'A', 'B', 'C', 'C',
    'D', 'E', 'F', 'G', 'A', 'B', 'C', 'C',
    'D', 'E', 'F', 'G', 'A', 'B', 'C', 'C',
    'D', 'E', 'F', 'G', 'A', 'B', 'C', 'C', 'D'
];

const FUNDAMENTAL_FREQUENCIES = {
    Bb: 233.08,
    B: 246.94,
    C: 261.63,
    D: 293.66,
    Eb: 311.13,
    F: 349.23,
    G: 392.00
};

enum PitchModel {
    FLUTE,
    WHISTLE
};

export class PitchSpeller {
    private fundamentalFrequency: number;
    private pitchModel: PitchModel;
    private knownFrequencies: number[];
    private midiNotes: number[];

    constructor(fundamental = 'D', mode = 'major') {
        this.fundamentalFrequency = FUNDAMENTAL_FREQUENCIES[fundamental];

        this.pitchModel = PitchModel.FLUTE;
        this.knownFrequencies = new Array(ABC_NOTE_RANGE);
        this.midiNotes = new Array(MIDI_NOTE_RANGE);

        this.makeScale(mode);
        this.makeMidiNotes();
    }

    private makeScale(mode: string) {
        // W - W - H - W - W - H - H - H
        let majorKeyIntervals = [1, 2, 4, 5];

        if (mode == 'major') {
            if (this.pitchModel == PitchModel.FLUTE) {
                this.knownFrequencies[0] = this.fundamentalFrequency / Math.pow(RATIO, 12);
            }
            else {
                // Use the whistle pitch model
                this.knownFrequencies[0] = this.fundamentalFrequency;
            }

            // W - W - H - W - W - W - H
            for (let i = 1; i < this.knownFrequencies.length; i++) {
                if (PitchSpeller.isWholeToneInterval(i, majorKeyIntervals)) {
                    this.knownFrequencies[i] = this.knownFrequencies[i - 1] * RATIO_SQUARED;
                }
                else {
                    this.knownFrequencies[i] = this.knownFrequencies[i - 1] * RATIO;
                }
            }
        }
    }

    private static isWholeToneInterval(n: number, intervals: number[]): boolean {
        n %= 8;
        return intervals.some(interval => interval == n);
    }

    private makeMidiNotes(): void {
        this.midiNotes[0] = 27.5;

        for (let i = 1; i < this.midiNotes.length; i++) {
            this.midiNotes[i] = this.midiNotes[i - 1] * RATIO;
        }
    }

    spellFrequency(frequency: number): string {
        let minIndex = 0;
        let minDiff = Number.MAX_VALUE;

        if (frequency < this.knownFrequencies[0] || frequency > this.knownFrequencies.slice(-1)[0]) {
            return 'Z';
        }

        for (let i = 0; i < this.knownFrequencies.length; i++) {
            let difference = Math.abs(frequency - this.knownFrequencies[i]);
            if (difference < minDiff) {
                minIndex = i;
                minDiff = difference;
            }
        }

        return NOTE_NAMES[minIndex];
    }

    spellFrequencyAsMidi(frequency: number): string {
        let minIndex = 0;
        let minDiff = Number.MAX_VALUE;

        if (frequency < this.midiNotes[0] || frequency > this.midiNotes.slice(-1)[0]) {
            return 'Z';
        }

        for (let i = 0; i < this.midiNotes.length; i++) {
            let difference = Math.abs(frequency - this.midiNotes[i]);
            if (difference < minDiff) {
                minIndex = i;
                minDiff = difference;
            }
        }

        minIndex += MIDI_OFFSET;
        return minIndex.toString();
    }
}


