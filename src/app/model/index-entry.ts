export class IndexEntry {
    constructor(
        /** Identity from X header */
        public id: string, 
        /** Position in tune array */
        public pos: number,
        /** Tune book reference */
        public book: string, 
        public title: string, 
        public titleNormalized: string, 
        public rhythm: string, 
        public key: string, 
        public tags?: string[]) {
    }

    hasTag(tag: string): boolean {
        return this.tags && this.tags.indexOf(tag) >= 0;       
    }
}