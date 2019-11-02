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
        const rhythm = tune.metaText.rhythm && tune.metaText.rhythm.toLowerCase();
        const staff = tune.lines.find(line => line['staff'] !== undefined) as MultiStaff;
        let key: Key = { root: 'C', mode: 'maj' };
        if (staff === undefined) {
            console.log(`${tuneBookEntry.id} ${tuneBookEntry.title}: ${rhythm} in undefined key`);
        } else {
            key = staff.staff[0].key;
            console.log(`${tuneBookEntry.id} ${tuneBookEntry.title}: ${rhythm} in ${key.root}${key.mode}`);
        }
        return {
            id: tuneBookEntry.id,
            rhythm,
            key: normalizeKey(key.root, key.mode)
        }
    }
}
