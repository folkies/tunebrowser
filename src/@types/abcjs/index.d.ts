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
        clickListener?: (abcElem: any, tuneNumber: number, classes: string[]) => void;
        responsive?: string; 
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

    export interface Tune {
        formatting: object;
        lines: object[];
        media: string;
        metaText: object;
        version: string;

        getBarLength(): number;
        getBeatLength(): number;
        getBeatsPerMeasure(): number;
        getBpm(): number;
        getMeter(): Meter;
        getMeterFraction(): Fraction;
        getPickupLength(): number;
        millisecondsPerMeasure(bpmOverride?: number): number;
    }

    export function numberOfTunes(abc: string): number;
    export function renderAbc(output: string, abc: string, params?: ParseParams | RenderParams): Tune[];
    export function renderMidi(output: string, abc: string): Tune[];
    export function parseOnly(abc: string, params?: ParseParams): Tune[];
    export const signature: string;
}
