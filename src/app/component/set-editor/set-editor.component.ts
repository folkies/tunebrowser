import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuneSet } from 'src/app/model/tune-set';
import { TuneSetRepository } from 'src/app/service/tune-set-repository';
import { TuneBookIndex } from 'src/app/service/tunebook-index';
import { IndexEntry } from 'src/app/model/index-entry';
import { TuneReference } from 'src/app/model/repertoire';
import { TuneQuery } from 'src/app/model/tune-query';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatList, MatListItem } from '@angular/material/list';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface TuneInSet {
    reference: TuneReference;
    entry: IndexEntry;
}

@Component({
    selector: 'app-set-editor',
    templateUrl: './set-editor.component.html',
    styleUrls: ['./set-editor.component.scss'],
    imports: [
        FormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        MatButton,
        MatIcon,
        MatIconButton,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatOption,
        MatList,
        MatListItem
    ]
})
export class SetEditorComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private repository = inject(TuneSetRepository);
    private index = inject(TuneBookIndex);

    set: TuneSet;
    tunesInSet: TuneInSet[] = [];
    searchText = '';
    filteredTunes: IndexEntry[] = [];

    async ngOnInit(): Promise<void> {
        await this.index.allReady.toPromise();
        const setId = this.route.snapshot.paramMap.get('id');
        if (setId) {
            this.set = await this.repository.getSet(setId);
            if (this.set) {
                this.loadTunesInSet();
            }
        }
    }

    loadTunesInSet(): void {
        this.tunesInSet = this.set.tunes.map(ref => {
            const entry = this.index.findEntryByTuneReference(ref);
            return { reference: ref, entry };
        }).filter(t => t.entry !== undefined);
    }

    onSearchTextChange(): void {
        if (this.searchText.trim().length >= 2) {
            const query = new TuneQuery(this.searchText);
            this.filteredTunes = this.index.findTunes(query).slice(0, 20);
        } else {
            this.filteredTunes = [];
        }
    }

    addTune(entry: IndexEntry): void {
        if (this.set.tunes.length >= 5) {
            alert('A set can contain a maximum of 5 tunes.');
            return;
        }
        const ref: TuneReference = { bookId: entry.book, tuneId: entry.id };
        this.set.tunes.push(ref);
        this.loadTunesInSet();
        this.searchText = '';
        this.filteredTunes = [];
    }

    removeTune(index: number): void {
        this.set.tunes.splice(index, 1);
        this.loadTunesInSet();
    }

    moveTuneUp(index: number): void {
        if (index > 0) {
            const temp = this.set.tunes[index];
            this.set.tunes[index] = this.set.tunes[index - 1];
            this.set.tunes[index - 1] = temp;
            this.loadTunesInSet();
        }
    }

    moveTuneDown(index: number): void {
        if (index < this.set.tunes.length - 1) {
            const temp = this.set.tunes[index];
            this.set.tunes[index] = this.set.tunes[index + 1];
            this.set.tunes[index + 1] = temp;
            this.loadTunesInSet();
        }
    }

    async save(): Promise<void> {
        await this.repository.updateSet(this.set);
        this.router.navigate(['/sets']);
    }

    cancel(): void {
        this.router.navigate(['/sets']);
    }

    canAddMore(): boolean {
        return this.set && this.set.tunes.length < 5;
    }
}
