import { MultiStaff, parseOnly, TuneBook, TuneBookEntry, Key } from 'abcjs/midi';
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

export function normalizeKey(root: string, mode: string): string {
    return `${root}${MODE_MAP[mode.toLowerCase()]}`;
}

export class MetadataExtractor {
    extract(tuneBookAbc: string): TuneDescriptor[] {
        const tuneBook = new TuneBook(tuneBookAbc);
        return tuneBook.tunes.map(tune => this.extractMetadata(tune));
    }

    extractMetadata(tuneBookEntry: TuneBookEntry): TuneDescriptor {
        const tune = parseOnly(tuneBookEntry.abc)[0];
        const key = tune.getKeySignature();
        const rhythm = tune.metaText.rhythm && tune.metaText.rhythm.toLowerCase();
        return {
            id: tuneBookEntry.id,
            rhythm,
            key: normalizeKey(key.root, key.mode)
        }
    }
}
