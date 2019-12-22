export interface TuneReference {
    bookId: string;
    tuneId: string;
}

export interface Repertoire {
    id: string;
    instrument: string;
    items: RepertoireItem[];
    maxAge: number;
    numTunesPerSession: number;
}

export interface RepertoireItem {
    tune: TuneReference;
    added: Date;
    due?: Date;

    numPracticed(): number;
    lastPracticed(): Date;
    practicedOn(date: Date): void;
}
