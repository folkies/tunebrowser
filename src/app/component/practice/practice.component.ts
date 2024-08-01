import { Component } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { IndexEntry } from 'src/app/model/index-entry';
import { Repertoire, RepertoireCollection, RepertoireItem } from 'src/app/model/repertoire';
import { titleWithoutNumber } from 'src/app/service/abc-util';
import { PracticeService } from 'src/app/service/practice-service';
import { RepertoireRepository } from 'src/app/service/repertoire-repository';
import { TuneBookIndex } from 'src/app/service/tunebook-index';
import { GoogleAuthService } from 'src/lib/google-sign-in';

/**
 * Builds and displays today's practice assignment for the default repertoire.
 */
@Component({
    selector: 'app-practice',
    templateUrl: './practice.component.html'
})
export class PracticeComponent {
    /** Today's practice assignment (intially undefined). */
    assignment: RepertoireItem[];

    /** Index entries corresponding to the assignment (initially undefined). */
    entries: IndexEntry[];

    repertoire: string;
    numTunes: number;
    maxAge: number;
    saved = false;

    titleWithoutNumber = titleWithoutNumber;
    private repertoireCollection: RepertoireCollection;

    constructor(
        private snackBar: MatSnackBar,
        private repertoireRepository: RepertoireRepository,
        private googleAuth: GoogleAuthService,
        private practiceService: PracticeService,
        private index: TuneBookIndex) {
        this.googleAuth.authState.subscribe(() => this.loadRepertoires());
    }

    private async loadRepertoires() {
        this.repertoireCollection = await this.repertoireRepository.load();
        if (this.repertoireCollection.current) {
            this.repertoire = this.repertoireCollection.current;
        }
        const repertoire = await this.repertoireRepository.findRepertoire();
        if (!repertoire) {
            return;
        }
        this.numTunes = repertoire.numTunesPerAssignment;
        this.maxAge = repertoire.maxAge;
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
        const repertoire = await this.repertoireRepository.findRepertoire(this.repertoire);
        if (this.numTunes > 0) {
            repertoire.numTunesPerAssignment = this.numTunes;
            repertoire.maxAge = this.maxAge;
            this.repertoireCollection.current = this.repertoire;
        }
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
            this.saved = true;
            this.snackBar.open(`Updated repertoire on Google Drive`, 'Dismiss', { duration: 3000 });
        } else {
            this.snackBar.open(`ERROR SAVING REPERTOIRE`, 'Dismiss', { duration: 3000 });
        }
    }

    repertoires(): Repertoire[] {
        if (this.repertoireCollection === undefined) {
            return [];
        }
        return this.repertoireCollection.repertoires;
    }
}
