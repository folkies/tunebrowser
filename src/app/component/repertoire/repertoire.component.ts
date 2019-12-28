import { Component, OnInit, ViewChild } from '@angular/core';
import { RepertoireItem } from 'src/app/model/repertoire';
import { titleWithoutNumber } from 'src/app/service/abc-util';
import { RepertoireRepository } from 'src/app/service/repertoire-repository';
import { TuneBookIndex } from 'src/app/service/tunebook-index';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface RepertoireTune {
    title: string;
    uri: string;
    added: Date;
    lastPracticed: Date;
    timesPracticed: number;
}

@Component({
    selector: 'repertoire',
    templateUrl: './repertoire.component.html'
})
export class RepertoireComponent implements OnInit {

    @ViewChild(MatSort, {static: true}) 
    sort: MatSort;

    dataSource: MatTableDataSource<RepertoireTune>;

    tunes: RepertoireTune[];
    displayedColumns: string[] = ['title', 'timesPracticed', 'lastPracticed', 'added'];

    titleWithoutNumber = titleWithoutNumber;

    constructor(
        private repertoireRepository: RepertoireRepository,
        private index: TuneBookIndex) {
            this.index.allReady.subscribe(() => this.loadRepertoire());
    }

    ngOnInit(): void {
    }

    private async loadRepertoire() {
        const rep = await this.repertoireRepository.findRepertoire();
        this.tunes = rep.items.map(item => this.toRepertoireTune(item));
        this.dataSource = new MatTableDataSource(this.tunes);
        this.dataSource.sort = this.sort;
    }

    private toRepertoireTune(item: RepertoireItem): RepertoireTune {
        const entry = this.index.findEntryByTuneReference(item.tune);
        return {
            added: item.added,
            lastPracticed: item.lastPracticed,
            timesPracticed: item.timesPracticed,
            title: titleWithoutNumber(entry.title),
            uri: `../tune/${item.tune.bookId}/${item.tune.tuneId}`
        };
    }
}
