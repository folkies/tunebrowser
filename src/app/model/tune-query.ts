import { TuneBookReference } from './tunebook-reference';

export class TuneQuery {
    constructor(public query: string, public books?: string[]) {

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