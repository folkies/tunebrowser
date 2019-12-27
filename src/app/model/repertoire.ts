import { max } from 'date-fns';

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
    practiceHistory: Date[];
}

export function referencedBy(item: RepertoireItem, ref: TuneReference): boolean {
    if (item && ref) {
        return item.tune.bookId == ref.bookId && item.tune.tuneId === ref.tuneId;
    }
    return false;
}

export function lastPracticed(item: RepertoireItem): Date {
    if (item.practiceHistory.length == 0) {
        return undefined;
    }
    return item.practiceHistory[item.practiceHistory.length - 1];
}

export function numPracticed(item: RepertoireItem): number {
    return item.practiceHistory.length;
}

export function practicedOn(item: RepertoireItem, date: Date, maxLength: number): void {
    item.practiceHistory.push(date);
    if (item.practiceHistory.length > maxLength) {
        item.practiceHistory.splice(0, this.practiceHistory.length - maxLength);
    }
}

export interface RepertoireCollection {
    repertoires: Repertoire[];
}
