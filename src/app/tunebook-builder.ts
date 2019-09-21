import { TuneBook } from 'abcjs';
import fs from 'fs';

export interface Reference {
    numeric: number;
    suffix: string;
}

export class TuneBookBuilder {

    tuneMap = new Map<string, string>();

    constructor(private inputDir: string) {
    }

    referenceCompare(left: string, right: string): number {
        const leftPair = this.toReference(left);
        const rightPair = this.toReference(right);
        const diff = leftPair.numeric - rightPair.numeric;
        if (diff !== 0) {
            return diff;
        }
        return leftPair.suffix.localeCompare(rightPair.suffix);
    }

    toReference(id: string): Reference {
        let suffixStart = id.length;
        for (let i = 0; i < id.length; i++) {
            const c = id.charAt(i);
            if (!this.isDigit(c)) {
                suffixStart = i;
                break;
            }
        }

        const numeric = Number(id.substring(0, suffixStart));
        const suffix = id.substring(suffixStart);
        return { numeric, suffix };
    }

    isDigit(c: string): boolean {
        return '0' <= c && c <= '9';
    }

    processFile(file: string): void {
        const text = fs.readFileSync(`${this.inputDir}/${file}`).toString();
        const id = this.extractId(file);
        const abc = text.replace(/^X:.*/, `X: ${id}`);
        const tuneBook = new TuneBook(abc);
        const firstTune = tuneBook.tunes[0].abc;
        this.tuneMap.set(id, firstTune);
    }

    extractId(fileName: string): string {
        const trimmed = fileName.trim();
        const dot = trimmed.indexOf('.');
        let start = 0;
        if (trimmed.charAt(0) === '0') {
            start = 1;
        }
        return fileName.substring(start, dot);
    }
}
