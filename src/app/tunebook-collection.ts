export interface TuneBookCollection {
    books: TuneBookDescriptor[];
}

export interface TuneBookDescriptor {
    path: string;
    name: string;
    description: string;
}