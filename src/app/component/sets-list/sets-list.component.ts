import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { TuneSet } from 'src/app/model/tune-set';
import { TuneSetRepository } from 'src/app/service/tune-set-repository';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatMiniFabButton, MatIconButton, MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { CreateSetDialogComponent } from '../create-set-dialog/create-set-dialog.component';
import { DeleteRepertoireItemComponent } from '../delete-repertoire-item/delete-repertoire-item.component';
import { TuneBookIndex } from 'src/app/service/tunebook-index';

@Component({
    selector: 'app-sets-list',
    templateUrl: './sets-list.component.html',
    styleUrls: ['./sets-list.component.scss'],
    imports: [
        MatButton,
        MatIcon,
        MatTable,
        MatSort,
        MatColumnDef,
        MatHeaderCellDef,
        MatHeaderCell,
        MatSortHeader,
        MatCellDef,
        MatCell,
        MatIconButton,
        MatMenuTrigger,
        MatMenu,
        MatMenuItem,
        MatHeaderRowDef,
        MatHeaderRow,
        MatRowDef,
        MatRow
    ]
})
export class SetsListComponent implements OnInit {
    private dialog = inject(MatDialog);
    private repository = inject(TuneSetRepository);
    private index = inject(TuneBookIndex);
    private router = inject(Router);

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    dataSource: MatTableDataSource<TuneSet>;
    sets: TuneSet[] = [];
    displayedColumns: string[] = ['name', 'tuneCount', 'created', 'modified', 'action'];

    async ngOnInit(): Promise<void> {
        this.index.allReady.subscribe(() => this.loadSets());
    }

    async loadSets(): Promise<void> {
        const collection = await this.repository.load();
        this.sets = collection.sets;
        this.dataSource = new MatTableDataSource(this.sets);
        this.dataSource.sort = this.sort;
    }

    openCreateSetDialog(): void {
        const dialogRef = this.dialog.open(CreateSetDialogComponent);
        dialogRef.afterClosed().subscribe(async (name: string) => {
            if (name) {
                await this.repository.createSet(name);
                await this.loadSets();
            }
        });
    }

    async deleteSet(set: TuneSet): Promise<void> {
        const dialogRef = this.dialog.open(DeleteRepertoireItemComponent, {
            data: `Delete set "${set.name}"?`
        });
        dialogRef.afterClosed().subscribe(async (confirmed: boolean) => {
            if (confirmed) {
                await this.repository.deleteSet(set.id);
                await this.loadSets();
            }
        });
    }

    viewSet(set: TuneSet): void {
        this.router.navigate(['/set', set.id]);
    }

    editSet(set: TuneSet): void {
        this.router.navigate(['/set', set.id, 'edit']);
    }
}
