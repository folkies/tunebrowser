import { TuneBook } from 'abcjs';
import fs from 'fs';

const inputDir = '/home/hwellmann/tmp/tunes';
const tuneMap = new Map<string, string>();

interface Reference {
    numeric: number;
    suffix: string;
}

function referenceCompare(left: string, right: string): number {
    const leftPair = toReference(left);
    const rightPair = toReference(right);
    const diff = leftPair.numeric - rightPair.numeric;
    if (diff !== 0) {
        return diff;
    }
    return leftPair.suffix.localeCompare(rightPair.suffix);
}

function toReference(id: string): Reference {
    let suffixStart = id.length;
    for (let i = 0; i < id.length; i++) {
        const c = id.charAt(i);
        if (!isDigit(c)) {
            suffixStart = i;
            break;
        }
    }

    const numeric = Number(id.substring(0, suffixStart));
    const suffix = id.substring(suffixStart);
    return { numeric, suffix };
}

function isDigit(c: string): boolean {
    return '0' <= c && c <= '9';
}

function processFile(file: string): void {
    const text = fs.readFileSync(`${inputDir}/${file}`).toString();
    const id = extractId(file);
    const abc = text.replace(/^X:.*/, `X: ${id}`);
    const tuneBook = new TuneBook(abc);
    const firstTune = tuneBook.tunes[0].abc;
    tuneMap.set(id, firstTune);
    console.log(file);
    console.log(firstTune);
}

function extractId(fileName: string): string {
    const trimmed = fileName.trim();
    const dot = trimmed.indexOf('.');
    let start = 0;
    if (trimmed.charAt(0) === '0') {
        start = 1;
    }
    return fileName.substring(start, dot);
}



describe('Tunebook builder', () => {

    test('should parse reference with suffix', () => {
        const ref = toReference('123a');
        expect(ref.numeric).toBe(123);
        expect(ref.suffix).toBe('a');
    });

    test('should parse reference without suffix', () => {
        const ref = toReference('152');
        expect(ref.numeric).toBe(152);
        expect(ref.suffix).toBe('');
    });

    test('should compare references', () => {
        expect(referenceCompare('6', '12')).toBeLessThan(0);
        expect(referenceCompare('60', '12')).toBeGreaterThan(0);
        expect(referenceCompare('12', '12')).toBe(0);
        expect(referenceCompare('12', '12a')).toBeLessThan(0);
        expect(referenceCompare('12b', '12a')).toBeGreaterThan(0);
    });

    test('should build tunebook', () => {
        const files = fs.readdirSync(inputDir);
        files.forEach(f => processFile(f));

        const sortedMap = new Map([...tuneMap].sort((left, right) => referenceCompare(left[0], right[0])));
        const text = Array.from(sortedMap.values()).join('\n\n');
        fs.writeFileSync('mytunebook.abc', text);
    });
});
