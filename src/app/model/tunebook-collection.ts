/**
 * Tunebook collection model. 
 * 
 * Corresponds to a `tunebook-collection.json` resource which defines all
 * available tunebooks. 
 */
export interface TuneBookCollection {
    /**
     * List of tune books.
     */
    books: TuneBookDescriptor[];
}

export type Storage = 'assets' | 'googledrive';

/**
 * Tunebook model.
 */
export interface TuneBookDescriptor {
    /**
     * A short unique alphanumeric identity which is used as URL path segment.
     */
    id: string;

    /**
     * Relative path of the tunebook from the `assets` folder.
     */
    uri: string;

    /**
     * Display name.
     */
    name: string;

    /**
     * More verbose description of this tunebook.
     */
    description: string;

    storage: Storage;

    tunes?: TuneDescriptor[];
}

export interface TuneDescriptor {
    id: string;
    rhythm?: string;
    key?: string;
    tags?: string[];
}

    export function mergeCollections(target: TuneBookCollection, mixin: TuneBookCollection): void {
        mixin.books.forEach(mixinBook => mergeBooks(target.books, mixinBook));
    }

    export function mergeBooks(targetBooks: TuneBookDescriptor[], mixinBook: TuneBookDescriptor): TuneBookDescriptor {
        const targetBook = targetBooks.find(book => book.id === mixinBook.id);
        if (targetBook === undefined) {
            targetBooks.push(mixinBook);
            return mixinBook;
        } else if (mixinBook.tunes) {
            if (targetBook.tunes === undefined) {
                targetBook.tunes = mixinBook.tunes;
            } else {
                mergeTunes(targetBook.tunes, mixinBook.tunes);
            }
        }
        return targetBook;
    }

    function mergeTunes(targetTunes: TuneDescriptor[], mixinTunes: TuneDescriptor[]) {
        mixinTunes.forEach(mixinTune => {
            const targetTune = targetTunes.find(tune => tune.id === mixinTune.id);
            if (targetTune === undefined) {
                targetTunes.push(mixinTune);
            } else {
                mergeTune(targetTune, mixinTune);
            }
        });
    }

    function mergeTune(targetTune: TuneDescriptor, mixinTune: TuneDescriptor) {
        if (targetTune.key === undefined) {
            targetTune.key = mixinTune.key;
        }

        if (targetTune.rhythm === undefined) {
            targetTune.rhythm = mixinTune.rhythm;
        }

        if (targetTune.tags === undefined) {
            targetTune.tags = mixinTune.tags;
        } else if (mixinTune.tags) {
            const tags = new Set(targetTune.tags);
            mixinTune.tags.forEach(tag => tags.add(tag));
            targetTune.tags = Array.from(tags.keys());
        }
    }
