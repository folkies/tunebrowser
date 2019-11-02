export class IndexEntry {
    constructor(
        public id: string, 
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