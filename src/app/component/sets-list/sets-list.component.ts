import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TuneSet } from 'src/app/model/tune-set';
import { TuneSetRepository } from 'src/app/service/tune-set-repository';
import { TuneBookIndex } from 'src/app/service/tunebook-index';
import { CreateSetDialogComponent } from '../create-set-dialog/create-set-dialog.component';
import { DeleteRepertoireItemComponent } from '../delete-repertoire-item/delete-repertoire-item.component';

@Component({
    selector: 'app-sets-list',
    templateUrl: './sets-list.component.html',
    imports: [
        FormsModule,
        MatFormField,
        MatLabel,
        MatSuffix,
        MatInput,
        MatButton,
        MatIconButton,
        MatIcon,
        MatChipSet,
        MatChip,
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
    allSets: TuneSet[] = [];
    displayedColumns: string[] = ['name', 'tags', 'tuneCount', 'created', 'modified', 'action'];
    filterText = '';

    // Get all unique tags from all sets
    get allTags(): string[] {
        const tagSet = new Set<string>();
        this.allSets.forEach(set => {
            if (set.tags) {
                set.tags.forEach(tag => tagSet.add(tag));
            }
        });
        return Array.from(tagSet).sort();
    }

    async ngOnInit(): Promise<void> {
        this.index.allReady.subscribe(() => this.loadSets());
    }

    async loadSets(): Promise<void> {
        const collection = await this.repository.load();
        this.allSets = collection.sets;
        this.applyFilter();
    }

    applyFilter(): void {
        const filterLower = this.filterText.toLowerCase().trim();
        if (!filterLower) {
            this.sets = [...this.allSets];
        } else {
            this.sets = this.allSets.filter(set => {
                // Match by name
                if (set.name.toLowerCase().includes(filterLower)) {
                    return true;
                }
                // Match by any tag
                if (set.tags && set.tags.some(tag => tag.toLowerCase().includes(filterLower))) {
                    return true;
                }
                return false;
            });
        }
        this.dataSource = new MatTableDataSource(this.sets);
        this.dataSource.sort = this.sort;
    }

    openCreateSetDialog(): void {
        const dialogRef = this.dialog.open(CreateSetDialogComponent);
        dialogRef.afterClosed().subscribe(async (result: { name: string, tags: string[] } | undefined) => {
            if (result && result.name) {
                await this.repository.createSet(result.name, result.tags);
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
