import { TuneReference } from './repertoire';

/**
 * A set is an ordered collection of up to 5 tunes.
 */
export interface TuneSet {
    /** Unique identifier for the set. */
    id: string;

    /** Display name of the set. */
    name: string;

    /** Ordered list of tune references (max 5). */
    tunes: TuneReference[];

    /** Tags for categorizing and filtering sets. */
    tags: string[];

    /** Date when the set was created. */
    created: Date;

    /** Date when the set was last modified. */
    modified: Date;
}

/**
 * Collection of tune sets.
 */
export interface TuneSetCollection {
    sets: TuneSet[];
}
