declare module "abcjs/midi" {
    export class TuneBook {
        tunes: TuneBookEntry[];
        constructor(abc: string);
        numberOfTunes(abc: string): number;
        getTuneById(id: string): TuneBookEntry;
        getTuneByTitle(title: string): TuneBookEntry;
    }

    export interface TuneBookEntry {
        abc: string;
        id: string;
        startPos: number;
        title: string;
    }

    export interface RenderParams {
        scale?: number;
        staffwidth?: number;
        paddingtop?: number;
        paddingbottom?: number;
        paddingright?: number;
        paddingleft?: number;
        add_classes?: boolean;
        responsive?: string; 
        clickListener?: (abcElem: any, tuneNumber: number, classes: string[]) => void;
    }

    export interface ParseParams {
        visualTranspose?: number;
        print?: boolean;
        header_only?: boolean;
        stop_on_warning?: boolean;
        hint_measures?: boolean;
        wrap?: Wrap; 
    }

    export interface Wrap {
        preferredMeasuresPerLine?: number;
        minSpacing?: number;
        maxSpacing?: number;
        lastLineLimit?: number;
        targetHeight?: number;
    }

    export interface Fraction {
        num: number;
        den: number;
    }

    export interface Meter {
        type: string;
    }

    export interface MetaText {
        author?: string;
        book?: string;
        composer?: string;
        discography?: string;
        url?: string;
        group?: string;
        instruction?: string;
        notes?: string;
        origin?: string;
        rhythm?: string;
        source?: string;
        unalignedWords?: string;
        transcription?: string;
    }

    export interface Staff {
        key: Key;
        meter: Meter;
    }

    export interface MultiStaff {
        staff: Staff;
    }

    export interface Key {
        mode: string;
        root: string;
    }

    export interface Tune {
        formatting: object;
        lines: object[];
        media: string;
        metaText: MetaText;
        version: string;

        getBarLength(): number;
        getBeatLength(): number;
        getBeatsPerMeasure(): number;
        getBpm(): number;
        getMeter(): Meter;
        getMeterFraction(): Fraction;
        getPickupLength(): number;
        getKeySignature(): Key;
        millisecondsPerMeasure(bpmOverride?: number): number;
    }

    export interface InlineControls {
        selectionToggle?: boolean;
        loopToggle?: boolean; 
        standard?: boolean;
        tempo?: boolean; 
        startPlaying?: boolean;
    }
    
    export interface MidiParams {
        qpm?: number;
        program?: number;
        midiTranspose?: number;
        voicesOff?: boolean;
        chordsOff?: boolean;
        generateDownload?: boolean;
        generateInline?: boolean;
        downloadClass?: string;
        downloadLabel?: string;
        preTextDownload?: string;
        postTextDownload?: string;
        preTextInline?: string;
        postTextInline?: string;
        context?: string;
        inlineControls?: InlineControls;
        drum?: string;
        drumBars?: number;
        drumIntro?: number;

        midiListener?: (abcJsElement: any, midiEvent: any) => void;
    }

    export interface Synth {
        instrumentIndexToName: string[];
    }

    export function numberOfTunes(abc: string): number;
    export function renderAbc(output: string, abc: string, params?: ParseParams | RenderParams): Tune[];
    export function renderMidi(output: string, abc: string, params?: MidiParams): Tune[];
    export function parseOnly(abc: string, params?: ParseParams): Tune[];
    export const signature: string;
    export const synth: Synth;
}
