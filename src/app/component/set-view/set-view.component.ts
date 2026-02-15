import { Component, OnInit, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { IndexEntry } from 'src/app/model/index-entry';
import { TuneSet } from 'src/app/model/tune-set';
import { TuneSetRepository } from 'src/app/service/tune-set-repository';
import { TuneBookIndex } from 'src/app/service/tunebook-index';
import { TuneViewComponent } from '../tune-view/tune-view.component';
import { purgeHeaders } from 'src/app/service/abc-util';

interface TuneWithAbc {
    entry: IndexEntry;
    abc: string;
}

@Component({
    selector: 'app-set-view',
    templateUrl: './set-view.component.html',
    styleUrls: ['./set-view.component.scss'],
    imports: [
        TuneViewComponent,
        MatButton,
        MatIcon
    ]
})
export class SetViewComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private repository = inject(TuneSetRepository);
    private index = inject(TuneBookIndex);

    set: TuneSet;
    tunesWithAbc: TuneWithAbc[] = [];

    async ngOnInit(): Promise<void> {
        this.index.allReady.subscribe(() => this.loadSet());
    }

    private async loadSet(): Promise<void> {
        const setId = this.route.snapshot.paramMap.get('id');
        if (setId) {
            this.set = await this.repository.getSet(setId);
            if (this.set) {
                this.loadTunes();
            }
        }
    }

    loadTunes(): void {
        this.tunesWithAbc = this.set.tunes.map(ref => {
            const entry = this.index.findEntryByTuneReference(ref);
            if (entry) {
                const abc = this.index.getAbc(entry);
                return { entry, abc };
            }
            return null;
        }).filter(t => t !== null);
    }

    editSet(): void {
        this.router.navigate(['/set', this.set.id, 'edit']);
    }

    backToList(): void {
        this.router.navigate(['/sets']);
    }

    tuneForDisplay(abc: string): string {
        return '%%stretchlast\n' + abc;
    }

    getConcatenatedAbc(): string {
        const concatenated = this.tunesWithAbc
            .map(tune => tune.abc.trim())
            .map(abc => purgeHeaders(abc))
            .join('\n').trim();
        console.log(concatenated);
        return '%%stretchlast\nX: 1\n' + concatenated;
    }

    openTune(entry: IndexEntry): void {
        this.router.navigate(['/tune', entry.book, entry.id]);
    }
}
