import { Injectable } from '@angular/core';
import { addDays, differenceInDays } from 'date-fns';
import { Repertoire, RepertoireItem } from '../model/repertoire';
import { INTERVALS } from './repertoire-repository';


/**
 * Adds 0, 1 or 2 days to the given date.
 * @param date date to be randomized
 * @returns randomized date
 */
function randomized(date: Date): Date {
    const numDays = Math.trunc(Math.random() * 3) - 1;
    return addDays(date, numDays);
}

/**
 * Builds a practice assignment from a repertoire.
 *
 * For new tunes, there is a list of N predefined intervals after which a tune is due for practice.
 * A new tune is due to be practiced every day for a week, then every two days for three times etc.
 *
 * A tune is no longer new when is has been practiced more than N times.
 *
 * An older tune is due for practice when it has not been practiced for a given number of days defined
 * as maximum age on the repertoire.
 *
 * The due date is randomized by adding up to two days to avoid repeating similar assignments.
 *
 * After computing the due date for all repertoire items, the items are sorted by (randomized) due date,
 * and the required number of items is taken from the list for the current assignment.
 * 
 * If the remaining sorted list contains any recent items (practiced not more than N times),
 * the assignment starts with up to N/2 items from these recent ones and is filled up with
 * items from the sorted due list.
 */
@Injectable()
export class PracticeService {

    /**
     * Builds a practice assignment for the given repertoire and the given day.
     * @param repertoire repertoire
     * @param day date for practice assignment
     */
    buildPracticeAssignment(repertoire: Repertoire, day: Date): RepertoireItem[] {
        const items = [...repertoire.items];
        items.forEach(item => this.computeDueDate(item, repertoire, day));
        items.sort((left, right) => differenceInDays(left.due, right.due));
        const assignment = items.filter(item => this.isDueOnDay(item, day));
        if (assignment.length >= repertoire.numTunesPerAssignment) {
            const due = assignment.slice(0, repertoire.numTunesPerAssignment);
            const remaining = assignment.slice(repertoire.numTunesPerAssignment + 1);
            const remainingRecent = remaining.filter(item => item.timesPracticed <= INTERVALS.length);
            if (remainingRecent.length > 0) {
                const part1 = remainingRecent.slice(0, repertoire.numTunesPerAssignment/ 2);
                const part2 = due.slice(0, repertoire.numTunesPerAssignment - part1.length);
                return part1.concat(part2);
            } else {
                return assignment.slice(0, repertoire.numTunesPerAssignment);
            }
        }
        const remaining = items.filter(item => !this.isDueOnDay(item, day) && !this.isRecentOnDay(item, day));
        return assignment.concat(remaining.slice(0, repertoire.numTunesPerAssignment - assignment.length));
    }

    private isDueOnDay(item: RepertoireItem, day: Date): boolean {
        return differenceInDays(item.due, day) <= 0;
    }

    private isRecentOnDay(item: RepertoireItem, day: Date): boolean {
        return differenceInDays(day, item.added) <= 30;
    }

    private computeDueDate(item: RepertoireItem, repertoire: Repertoire, day: Date): void {
        const age = differenceInDays(randomized(day || new Date()), item.added);
        if (age > repertoire.maxAge || item.timesPracticed >= INTERVALS.length) {
            const practiced = item.lastPracticed || item.added;
            item.due = addDays(randomized(practiced), repertoire.maxAge);
        } else if (item.timesPracticed > 0) {
            const interval = INTERVALS[item.timesPracticed];
            item.due = addDays(randomized(item.lastPracticed), interval);
        } else {
            item.due = item.added;
        }
    }

    /**
     * Marks the given repertoire items as last practiced on the given date.
     * @param items repertoire items
     * @param lastPracticed last practiced on this date
     */
    markAsPracticed(items: RepertoireItem[], lastPracticed: Date): void {
        items.forEach(item => item.practicedOn(lastPracticed));
    }
}
