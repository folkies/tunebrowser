import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { RepertoireItem, RepertoireCollection, Repertoire } from 'src/app/model/repertoire';
import { titleWithoutNumber } from 'src/app/service/abc-util';
import { RepertoireRepository } from 'src/app/service/repertoire-repository';
import { TuneBookIndex } from 'src/app/service/tunebook-index';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { NewRepertoireComponent } from '../new-repertoire/new-repertoire.component';
import { DeleteRepertoireItemComponent } from '../delete-repertoire-item/delete-repertoire-item.component';
import { MatMiniFabButton, MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';

export interface RepertoireTune {
    item: RepertoireItem;
    title: string;
    uri: string;
    added: Date;
    lastPracticed: Date;
    timesPracticed: number;
}

@Component({
    selector: 'app-repertoire',
    templateUrl: './repertoire.component.html',
    imports: [MatMiniFabButton, MatMenuTrigger, MatIcon, MatMenu, MatMenuItem, MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, RouterLink, MatIconButton, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow]
})
export class RepertoireComponent implements OnInit {
    private dialog = inject(MatDialog);
    private repertoireRepository = inject(RepertoireRepository);
    private index = inject(TuneBookIndex);
    private route = inject(ActivatedRoute);
    private router = inject(Router);


    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    dataSource: MatTableDataSource<RepertoireTune>;

    tunes: RepertoireTune[] = [];
    displayedColumns: string[] = ['title', 'timesPracticed', 'lastPracticed', 'added', 'action'];

    titleWithoutNumber = titleWithoutNumber;

    currentRepertoire: Repertoire;

    private repertoireCollection: RepertoireCollection;

    ngOnInit(): void {
        this.index.allReady.subscribe(() => {
            this.route.paramMap.subscribe(() => {
                this.loadRepertoire();
            });
        });
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

    openDeleteRepertoireDialog(): void {
        const dialogRef = this.dialog.open(DeleteRepertoireItemComponent, { data: `Delete "${this.currentRepertoire.name}" repertoire?` });
        dialogRef.afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.deleteCurrentRepertoire();
            }
        });
    }
    selectRepertoire(repertoire: Repertoire): void {
        this.router.navigate(['/repertoire', repertoire.name]);
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

    private async deleteCurrentRepertoire(): Promise<void> {
        await this.repertoireRepository.deleteRepertoire(this.currentRepertoire.name);
        await this.loadRepertoire();
    }

    private async loadRepertoire() {
        this.repertoireCollection = await this.repertoireRepository.load();
        
        // Check if a specific repertoire name is requested via route parameter
        const routeName = this.route.snapshot.paramMap.get('name');
        let rep: Repertoire;
        
        if (routeName) {
            // Find repertoire by name from URL
            rep = this.repertoireCollection.repertoires.find(r => r.name === routeName);
            if (!rep) {
                // If not found, fall back to default
                rep = await this.repertoireRepository.findRepertoire();
            }
        } else {
            // No name specified, use default
            rep = await this.repertoireRepository.findRepertoire();
        }
        
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
            added: item.added,
            lastPracticed: item.lastPracticed,
            timesPracticed: item.timesPracticed,
            title: titleWithoutNumber(entry.title),
            uri: `/tune/${item.tune.bookId}/${item.tune.tuneId}`
        };
    }
}
