/**
 * References a tune.
 */
export interface TuneReference {
    /** Tune book identity. */
    bookId: string;

    /** Tune identity. */
    tuneId: string;
}

/**
 * Repertoire for a given instrument.
 */
export interface Repertoire {
    /** Repertoire identity. */
    id: string;

    /** Instrument (display name). */
    instrument: string;

    /** Tunes in repertoire. */
    items: RepertoireItem[];

    /** Maximum age for tunes. Older tunes are due for practice. */
    maxAge: number;

    /** Number of tunes per practice assignment. */
    numTunesPerAssignment: number;
}

/**
 * Repertoire item.
 */
export interface RepertoireItem {

    /** Tune reference. */
    tune: TuneReference;

    /** Tune was added to repertoire on this date. */
    added: Date;

    /** Tune is due to be practiced on this date. */
    due?: Date;

    /** Length of (truncated) practice history. */
    timesPracticed: number;

    /**
     * Tune was last practiced on this date. (Last item of practice history.)
     */
    lastPracticed?: Date;

    /**
     * Adds the given date to the practice history, optionally truncating the history to maximum length.
     * @param date practice date
     */
    practicedOn(date: Date): void;

    /**
     * Checks if this item corresponds to the given tune reference.
     * @param ref tune reference
     * @returns true if this item is referenced
     */
    referencedBy(ref: TuneReference): boolean;
}

/**
 * Collection of repertoires for different instruments.
 */
export interface RepertoireCollection {
    repertoires: Repertoire[];
}
