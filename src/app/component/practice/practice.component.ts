import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IndexEntry } from 'src/app/model/index-entry';
import { RepertoireItem } from 'src/app/model/repertoire';
import { PracticeService } from 'src/app/service/practice-service';
import { RepertoireRepository } from 'src/app/service/repertoire-repository';
import { TuneBookIndex } from 'src/app/service/tunebook-index';
import { titleWithoutNumber } from 'src/app/service/abc-util';

@Component({
    selector: 'practice',
    templateUrl: './practice.component.html'
})
export class PracticeComponent {

    entries: IndexEntry[];
    assignment: RepertoireItem[];

    titleWithoutNumber = titleWithoutNumber;

    constructor(
        private snackBar: MatSnackBar, 
        private repertoireRepository: RepertoireRepository,
        private practiceService: PracticeService,
        private index: TuneBookIndex) {
    }

    initial(): boolean {
        return this.entries === undefined;
    }

    async buildAssignment(): Promise<void> {
        const repertoire = await this.repertoireRepository.findRepertoire();
        this.assignment = this.practiceService.buildPracticeSession(repertoire, new Date());
        this.entries = this.assignment.map(item => this.index.findEntryByTuneReference(item.tune))
    }

   async markAsPracticed(): Promise<void> {
       this.practiceService.markAsPracticed(this.assignment, new Date());
       await this.repertoireRepository.save();
       this.snackBar.open(`Updated repertoire on Google Drive`, 'Dismiss', { duration: 3000 });
    }
}
