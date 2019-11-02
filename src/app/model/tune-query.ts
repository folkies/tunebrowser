import { TuneBookReference } from './tunebook-reference';

export function titleQuery(title: string): TuneQuery {
    return new TuneQuery(title);
}

export function tagQuery(...tags: string[]) {
    return new TuneQuery(undefined, undefined, undefined, undefined, tags);
}

export class TuneQuery {
    constructor(public title: string, public rhythm?: string, public key?: string, public books?: string[], public tags?: string[]) {
    }

    matchesRef(tuneBookRef: TuneBookReference): boolean {
        if (this.allBooks()) {
            return true;
        }
        return this.books.includes(tuneBookRef.descriptor.id);
    }

    matchesName(bookName: string): boolean {
        if (this.allBooks()) {
            return true;
        }
        return this.books.includes(bookName);
    }

    private allBooks(): boolean {
        return !this.books || this.books.length === 0;
    }   
}