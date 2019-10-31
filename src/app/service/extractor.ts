import { MultiStaff, parseOnly, TuneBook, TuneBookEntry } from 'abcjs/midi';
import { Key, Mode } from '../model/index-entry';
import { TuneDescriptor  } from '../model/tunebook-collection';

const MODE_MAP = {
    "": "maj",
    "m": "min",
    "maj": "maj",
    "dor": "dor",
    "min": "mín",
    "lyd": "lyd",
    "mix": "mix",
    "phr": "phr",
    "loc": "loc"
};

export function normalizeMode(mode: string): Mode {
    return MODE_MAP[mode.toLowerCase()];
}

export class Extractor {
    extract(tuneBookAbc: string): TuneDescriptor[] {
        const tuneBook = new TuneBook(tuneBookAbc);
        return tuneBook.tunes.map(tune => this.extractMetadata(tune));
    }

    extractMetadata(tuneBookEntry: TuneBookEntry): TuneDescriptor {
        const tune = parseOnly(tuneBookEntry.abc)[0];
        const rhythm = tune.metaText.rhythm && tune.metaText.rhythm.toLowerCase();
        const staff = tune.lines.find(line => line['staff'] !== undefined) as MultiStaff;
        let key: Key;
        if (staff === undefined) {
            console.log(`${tuneBookEntry.id} ${tuneBookEntry.title}: ${rhythm} in undefined key`);
        } else {
            key = staff.staff[0].key;
            console.log(`${tuneBookEntry.id} ${tuneBookEntry.title}: ${rhythm} in ${key.root}${key.mode}`);
        }
        return {
            id: tuneBookEntry.id,
            rhythm,
            key: {
                root: key.root,
                mode: normalizeMode(key.mode)
            }
        }
    }
}
