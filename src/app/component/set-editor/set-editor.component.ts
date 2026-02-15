import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { IndexEntry } from 'src/app/model/index-entry';
import { TuneReference } from 'src/app/model/repertoire';
import { TuneQuery } from 'src/app/model/tune-query';
import { TuneSet } from 'src/app/model/tune-set';
import { MAX_TUNES_PER_SET, TuneSetRepository } from 'src/app/service/tune-set-repository';
import { TuneBookIndex } from 'src/app/service/tunebook-index';

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

    readonly maxTunes = MAX_TUNES_PER_SET;
    
    set: TuneSet;
    tunesInSet: TuneInSet[] = [];
    searchText = '';
    filteredTunes: IndexEntry[] = [];
    tagsText = '';

    async ngOnInit(): Promise<void> {
        this.index.allReady.subscribe(() => this.loadSet());
    }

    private async loadSet(): Promise<void> {
        const setId = this.route.snapshot.paramMap.get('id');
        if (setId) {
            this.set = await this.repository.getSet(setId);
            if (this.set) {
                this.loadTunesInSet();
                this.tagsText = (this.set.tags || []).join(', ');
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
        if (this.set.tunes.length >= MAX_TUNES_PER_SET) {
            alert(`A set can contain a maximum of ${MAX_TUNES_PER_SET} tunes.`);
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
        // Parse tags from the text input
        this.set.tags = this.tagsText.split(',').map(t => t.trim()).filter(t => t.length > 0);
        await this.repository.updateSet(this.set);
        this.router.navigate(['/sets']);
    }

    cancel(): void {
        this.router.navigate(['/sets']);
    }

    canAddMore(): boolean {
        return this.set && this.set.tunes.length < MAX_TUNES_PER_SET;
    }
}
