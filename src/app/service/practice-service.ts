import { Injectable } from '@angular/core';
import { addDays, differenceInDays } from 'date-fns';

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

export class RepertoireItem {
    private practiceHistory: Date[] = [];
    due?: Date;

    constructor(public tune: TuneReference, public added: Date) {

    }

    numPracticed(): number {
        return this.practiceHistory.length;
    }

    lastPracticed(): Date {
        if (this.practiceHistory.length == 0) {
            return undefined;
        }
        return this.practiceHistory[this.practiceHistory.length - 1];
    }

    practicedOn(date: Date): void {
        this.practiceHistory.push(date);
        if (this.practiceHistory.length > INTERVALS.length) {
            this.practiceHistory.splice(0, this.practiceHistory.length - INTERVALS.length);
        }
    }
}

const INTERVALS : number [] = [ 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 6, 6, 15 ];

function randomized(date: Date): Date {
    const numDays = Math.trunc(Math.random() * 3) - 1;
    return addDays(date, numDays);
}

@Injectable()
export class PracticeService {

    buildPracticeSession(repertoire: Repertoire, date?: Date): RepertoireItem[] {
        const items = [...repertoire.items];
        const day = date || new Date();
        items.forEach(item => this.computeDueDate(item, repertoire, day));
        items.sort((left, right) => differenceInDays(left.due, right.due));
        const assignment = items.filter(item => this.isDueOnDay(item, day));
        if (assignment.length >= repertoire.numTunesPerSession) {
            return assignment.slice(0, repertoire.numTunesPerSession);
        }
        const remaining = items.filter(item => !this.isDueOnDay(item, day) && !this.isRecentOnDay(item, day));
        return assignment.concat(remaining.slice(0, repertoire.numTunesPerSession - assignment.length));
    }

    private isDueOnDay(item: RepertoireItem, day: Date): boolean {
        return differenceInDays(item.due, day) <= 0;
    }
 
    private isRecentOnDay(item: RepertoireItem, day: Date): boolean {
        return differenceInDays(day, item.added) <= 30;
    }
 
    private computeDueDate(item: RepertoireItem, repertoire: Repertoire, day: Date): void {
        const age = differenceInDays(randomized(day || new Date()), item.added);
        if (age > repertoire.maxAge || item.numPracticed() >= INTERVALS.length) {
            const lastPracticed = item.lastPracticed() || item.added;
            item.due = addDays(randomized(lastPracticed), repertoire.maxAge);
        } else if (item.numPracticed() > 0) {
            const interval = INTERVALS[item.numPracticed()];
            item.due = addDays(randomized(item.lastPracticed()), interval);
        } else {
            item.due = day;
        }
    }

    markAsPracticed(items: RepertoireItem[], date?: Date) {
        const lastPracticed = date || new Date();
        items.forEach(item => item.practicedOn(lastPracticed));
    }
}