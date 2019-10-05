import { TuneBookReference } from './tunebook-reference';
import { IndexEntry } from './index-entry';

export class TuneQuery {
    constructor(public query: string, public books?: string[]) {

    }

    matchesRef(tuneBookRef: TuneBookReference): boolean {
        if (!this.books) {
            return true;
        }
        return this.books.includes(tuneBookRef.descriptor.path);
    }

    matchesName(bookName: string): boolean {
        if (!this.books) {
            return true;
        }
        return this.books.includes(bookName);
    }
    
}