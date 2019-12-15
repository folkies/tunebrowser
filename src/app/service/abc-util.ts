import { parseOnly, TuneBook, TuneBookEntry } from 'abcjs/midi';
import { TuneDescriptor } from '../model/tunebook-collection';

const MODE_MAP = {
    "": "",
    "m": "m",
    "maj": "",
    "dor": "dor",
    "min": "mix",
    "lyd": "lyd",
    "mix": "mix",
    "phr": "phr",
    "loc": "loc"
};

/**
 * Normalizes a key representation, e.g. Gmaj -> G.
 * @param root root note
 * @param mode mode name
 * @returns normalized key
 */
export function normalizeKey(root: string, mode: string): string {
    return `${root}${MODE_MAP[mode.toLowerCase()]}`;
}

/**
 * Extracts metadata for all tunes from a tunebook.
 * @param tuneBookAbc tunebook as ABC string
 * @returns array of metadata (id, rhythm and normalized key)
 */
export function extractAllMetadata(tuneBookAbc: string): TuneDescriptor[] {
    const tuneBook = new TuneBook(tuneBookAbc);
    return tuneBook.tunes.map(tune => this.extractMetadata(tune));
}

/**
 * Extracts metadata from the given tune.
 * @param tuneBookAbc tune as ABC string
 * @returns metadata (id, rhythm and normalized key)
 */
export function extractMetadata(tuneBookEntry: TuneBookEntry): TuneDescriptor {
    const tune = parseOnly(tuneBookEntry.abc)[0];
    const key = tune.getKeySignature();
    const rhythm = tune.metaText.rhythm && tune.metaText.rhythm.toLowerCase();
    return {
        id: tuneBookEntry.id,
        rhythm,
        key: normalizeKey(key.root, key.mode)
    }
}

/**
 * Extracts a snippet of the first two or three bars, including only a minimum subset of headers.
 * We include everything up to the third bar line, which covers at least two bars and and optional upbeat.
 * @param abc complete tune
 * @returns snippet (incipit)
 */
export function extractSnippet(abc: string): string {
    const lines = abc.split('\n');
    const filteredLines = [];
    const bars = [];
    for (const line of lines) {
        // headers
        if (/^[A-Za-z]:/.test(line)) {
            // only keep headers absolutely required
            if (/^[XMLK]:/.test(line)) {
                filteredLines.push(line);
            }
        } else {
            bars.push(...line.split('|'));
            if (bars.length > 2) {
                filteredLines.push(bars.slice(0, 3).join('|'));
                break;
            }
        }
    }
    return filteredLines.join('\n');
}
