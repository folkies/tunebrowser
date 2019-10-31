export type Note = string;
export type Mode = "maj" | "dor" | "phr" | "lyd" | "mix" | "min" | "loc";

export class Key {
    root: Note;
    mode: Mode;
}
export class IndexEntry {
    constructor(
        public id: string, 
        public book: string, 
        public title: string, 
        public titleNormalized: string, 
        public rhythm: string, 
        public key: Key, 
        public tags?: string[]) {

    }

    hasTag(tag: string): boolean {
        return this.tags && this.tags.indexOf(tag) >= 0;       
    }
}