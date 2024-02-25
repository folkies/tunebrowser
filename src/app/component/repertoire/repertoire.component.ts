import { Component, OnInit, ViewChild } from '@angular/core';
import { RepertoireItem, RepertoireCollection, Repertoire } from 'src/app/model/repertoire';
import { titleWithoutNumber } from 'src/app/service/abc-util';
import { RepertoireRepository } from 'src/app/service/repertoire-repository';
import { TuneBookIndex } from 'src/app/service/tunebook-index';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { NewRepertoireComponent } from '../new-repertoire/new-repertoire.component';
import { DeleteRepertoireItemComponent } from '../delete-repertoire-item/delete-repertoire-item.component';

export interface RepertoireTune {
    item: RepertoireItem;
    title: string;
    uri: string;
}

@Component({
    selector: 'app-repertoire',
    templateUrl: './repertoire.component.html'
})
export class RepertoireComponent implements OnInit {

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    dataSource: MatTableDataSource<RepertoireTune>;

    tunes: RepertoireTune[] = [];
    displayedColumns: string[] = ['title', 'timesPracticed', 'lastPracticed', 'added', 'action'];

    titleWithoutNumber = titleWithoutNumber;

    currentRepertoire: Repertoire;

    private repertoireCollection: RepertoireCollection;

    constructor(
        private dialog: MatDialog,
        private repertoireRepository: RepertoireRepository,
        private index: TuneBookIndex) {
    }

    ngOnInit(): void {
        this.index.allReady.subscribe(() => this.loadRepertoire());
    }

    newRepertoire(rep: Repertoire) {
        if (rep) {
            this.repertoireCollection.repertoires.push(rep);
            this.selectRepertoire(rep);
        }
    }

    openNewRepertoireDialog(): void {
        const dialogRef = this.dialog.open(NewRepertoireComponent);
        dialogRef.afterClosed().subscribe(added => this.newRepertoire(added));
    }

    selectRepertoire(repertoire: Repertoire): void {
        this.currentRepertoire = repertoire;
        this.prepareTunes();
    }

    repertoires(): Repertoire[] {
        if (this.repertoireCollection === undefined) {
            return [];
        }
        return this.repertoireCollection.repertoires;
    }

    async deleteTune(tune: RepertoireTune): Promise<void> {
        const dialogRef = this.dialog.open(DeleteRepertoireItemComponent, { data: `Delete "${tune.title}" from repertoire?` });
        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.doDeleteTune(tune);
            }
        });
    }

    private async doDeleteTune(tune: RepertoireTune): Promise<void> {
        await this.repertoireRepository.deleteRepertoireItem(tune.item.tune, this.currentRepertoire.name);
        this.prepareTunes();
    }

    private async loadRepertoire() {
        this.repertoireCollection = await this.repertoireRepository.load();
        const rep = await this.repertoireRepository.findRepertoire();
        this.currentRepertoire = rep;
        if (!rep) {
            return;
        }
        this.prepareTunes();
    }

    private prepareTunes(): void {
        this.tunes = this.currentRepertoire.items.map(item => this.toRepertoireTune(item));
        this.dataSource = new MatTableDataSource(this.tunes);
        this.dataSource.sort = this.sort;
    }

    private toRepertoireTune(item: RepertoireItem): RepertoireTune {
        const entry = this.index.findEntryByTuneReference(item.tune);
        return {
            item,
            title: titleWithoutNumber(entry.title),
            uri: `../tune/${item.tune.bookId}/${item.tune.tuneId}`
        };
    }
}
