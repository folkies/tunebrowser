import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IndexEntry } from 'src/app/model/index-entry';
import { RepertoireItem } from 'src/app/model/repertoire';
import { PracticeService } from 'src/app/service/practice-service';
import { RepertoireRepository } from 'src/app/service/repertoire-repository';
import { TuneBookIndex } from 'src/app/service/tunebook-index';
import { titleWithoutNumber } from 'src/app/service/abc-util';

/**
 * Builds and displays today's practice assignment for the default repertoire.
 */
@Component({
    selector: 'practice',
    templateUrl: './practice.component.html'
})
export class PracticeComponent implements OnInit {
    /** Today's practice assignment (intially undefined). */
    assignment: RepertoireItem[];

    /** Index entries corresponding to the assignment (initially undefined). */
    entries: IndexEntry[];

    titleWithoutNumber = titleWithoutNumber;

    constructor(
        private snackBar: MatSnackBar,
        private repertoireRepository: RepertoireRepository,
        private practiceService: PracticeService,
        private index: TuneBookIndex) {
    }

    ngOnInit(): void {
        if (this.repertoireRepository.currentAssignment) {
            this.assignment = this.repertoireRepository.currentAssignment;
            this.entries = this.assignment.map(item => this.index.findEntryByTuneReference(item.tune))
        }
    }

    /**
     * Checks if assignment has already been computed.
     * @returns true if assignment is present
     */
    hasAssignment(): boolean {
        return this.entries !== undefined;
    }

    /**
     * Builds today's assignment from the default repertoire and finds the corresponding 
     * index entries.
     */
    async buildAssignment(): Promise<void> {
        const repertoire = await this.repertoireRepository.findRepertoire();
        this.assignment = this.practiceService.buildPracticeAssignment(repertoire, new Date());
        this.repertoireRepository.currentAssignment = this.assignment;
        this.entries = this.assignment.map(item => this.index.findEntryByTuneReference(item.tune))
    }

    /**
     * Marks all items from today's assignment as practiced.
     */
    async markAsPracticed(): Promise<void> {
        this.practiceService.markAsPracticed(this.assignment, new Date());
        const id = await this.repertoireRepository.save();
        if (id) {
            this.snackBar.open(`Updated repertoire on Google Drive`, 'Dismiss', { duration: 3000 });
        } else {
            this.snackBar.open(`ERROR SAVING REPERTOIRE`, 'Dismiss', { duration: 3000 });
        }
    }
}
