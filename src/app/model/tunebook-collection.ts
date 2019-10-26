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

    storage: string;

    status?: string;

    tunes?: TuneDescriptor[];
}

export interface TuneDescriptor {
    id: string;
    tags?: string[];
}