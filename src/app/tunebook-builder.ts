import { TuneBook, TuneBookEntry } from 'abcjs/midi';
import fs from 'fs';

import iconv from 'iconv-lite';

export interface Reference {
    numeric: number;
    suffix: string;
}

export class TuneBookBuilder {

    tuneMap = new Map<string, string>();

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

    processSingleFile(file: string): void {
        const text = fs.readFileSync(file).toString();
        const id = this.extractId(file);
        const abc = text.replace(/^X:.*/, `X: ${id}`);
        const tuneBook = new TuneBook(abc);
        const firstTune = tuneBook.tunes[0].abc;
        this.tuneMap.set(id, firstTune);
    }

    processBookFile(file: string): void {
        const bytes = fs.readFileSync(file);
        const text = iconv.decode(bytes, 'windows1252');
        const abc = text.replace(/^%%abc-.*$/mg, '');
        const tuneBook = new TuneBook(abc);
        tuneBook.tunes.forEach(entry => this.processTuneBookEntry(entry));
    }

    processTuneBookEntry(entry: TuneBookEntry): void {
        const id = this.extractIdFromTitle(entry.title);
        const abc = entry.abc.replace(/^X:.*/m, `X: ${id}`);
        this.tuneMap.set(id, abc);
    }

    extractIdFromTitle(title: string) {
        const words = title.trim().split(' ');
        return words.shift();
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

    buildSortedBook(): string {
        const sortedMap = new Map([...this.tuneMap].sort((left, right) => this.referenceCompare(left[0], right[0])));
        return Array.from(sortedMap.values()).join('\n\n');
    }
}
