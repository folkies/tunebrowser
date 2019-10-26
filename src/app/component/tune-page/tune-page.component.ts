import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TuneBookCollectionService } from 'src/app/service/tunebook-collection.service';
import { TuneQuery } from '../../model/tune-query';
import { TuneBookIndex } from '../../service/tunebook-index';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-tune-page',
    templateUrl: './tune-page.component.html'
})
export class TunePageComponent implements OnInit {

    tune = '';
    allTags = '';

    private bookId: string;
    private ref: string;

    constructor(
        private index: TuneBookIndex,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar,
        private collectionService: TuneBookCollectionService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(map => this.consumeRef(map));
        this.index.tuneBookReady.subscribe(() => {
            this.displayTune(this.bookId, this.ref);
        });
    }

    async save(): Promise<string> {
        const tags = this.allTags.split(/\s*,\s*/);
        const id = await this.collectionService.setTagsForTune(this.ref, this.bookId, tags);
        this.snackBar.open(`Updated tags on Google Drive`, 'Dismiss', { duration: 3000 });
        return id;
    }

    private consumeRef(map: ParamMap): void {
        this.ref = map.get('ref');
        this.bookId = map.get('bookId');
        this.displayTune(this.bookId, this.ref);
    }

    private displayTune(bookId: string, ref: string): void {
        if (ref !== undefined && this.index.isReady()) {
            const tunes = this.index.findTunes(new TuneQuery(ref, [bookId]));
            if (tunes.length > 0) {
                const entry = tunes[0];
                this.tune = this.index.getAbc(entry);
                if (entry.tags) { 
                    this.allTags = entry.tags.join(', ');
                }
            }
        }
    }
}
