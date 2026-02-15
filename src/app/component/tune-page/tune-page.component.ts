import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { PdfService } from 'src/app/service/pdf-service';
import { RepertoireRepository } from 'src/app/service/repertoire-repository';
import { csvToArray } from 'src/app/service/tags';
import { TuneBookCollectionService } from 'src/app/service/tunebook-collection.service';
import { TuneSetRepository } from 'src/app/service/tune-set-repository';
import { TuneSet } from 'src/app/model/tune-set';
import { Repertoire } from 'src/app/model/repertoire';
import { GoogleAuthService } from 'src/lib/google-sign-in';
import { TuneBookIndex } from '../../service/tunebook-index';
import { AddToRepertoireComponent, RepertoireSelection } from '../add-to-repertoire/add-to-repertoire.component';
import { TunePlayerComponent } from '../tune-player/tune-player.component';
import { MatLabel, MatFormField } from '@angular/material/form-field';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { TuneViewComponent } from '../tune-view/tune-view.component';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';


@Component({
    selector: 'app-tune-page',
    templateUrl: './tune-page.component.html',
    imports: [TunePlayerComponent, MatLabel, MatSlider, MatSliderThumb, FormsModule, TuneViewComponent, MatFormField, MatInput, MatButton, MatIcon, RouterLink]
})
export class TunePageComponent implements OnInit {
    private index = inject(TuneBookIndex);
    private googleAuth = inject(GoogleAuthService);
    private pdfService = inject(PdfService);
    private route = inject(ActivatedRoute);
    private snackBar = inject(MatSnackBar);
    private dialog = inject(MatDialog);
    private collectionService = inject(TuneBookCollectionService);
    private repertoireRepository = inject(RepertoireRepository);
    private tuneSetRepository = inject(TuneSetRepository);


    tune = '';
    allTags = '';
    signedIn = false;

    prevRef: string;
    nextRef: string;

    containingSets: TuneSet[] = [];
    containingRepertoires: Repertoire[] = [];

    private bookId: string;
    private ref: string;

    constructor() {

        this.googleAuth.authState.subscribe(auth => {
            this.signedIn = !!auth;
        });
    }

    ngOnInit() {
        this.route.paramMap.subscribe(map => this.consumeRef(map));
        this.index.tuneBookReady.subscribe(() => {
            this.displayTune(this.bookId, this.ref);
        });
    }

    async save(): Promise<string> {
        const tags = csvToArray(this.allTags);
        const id = await this.collectionService.setTagsForTune(this.ref, this.bookId, tags);
        this.snackBar.open(`Updated tags on Google Drive`, 'Dismiss', { duration: 3000 });
        return id;
    }

    async openDialog(): Promise<void> {
        const dialogRef = this.dialog.open(AddToRepertoireComponent);
        dialogRef.afterClosed().subscribe(added => this.addToRepertoire(added));
    }

    async exportAsPdf(): Promise<void> {
        this.pdfService.saveAsPdf(this.tune);
        this.snackBar.open(`PDF will be displayed in separate window`, 'Dismiss', { duration: 3000 });
    }

    tuneForDisplay(): string {
        return '%%stretchlast\n' + this.tune;
    }

    private async addToRepertoire(selection: RepertoireSelection): Promise<void> {
        if (!selection) {
            return;
        }
        const tuneRef = { bookId: this.bookId, tuneId: this.ref };
        await this.repertoireRepository.addRepertoireItem(tuneRef, selection);
        this.snackBar.open(`Added to repertoire on Google Drive`, 'Dismiss', { duration: 3000 });
    }

    private consumeRef(map: ParamMap): void {
        this.ref = map.get('ref');
        this.bookId = map.get('bookId');
        this.displayTune(this.bookId, this.ref);
    }

    private async displayTune(bookId: string, ref: string): Promise<void> {
        if (ref !== undefined && this.index.isReady()) {
            const entry = this.index.findEntryByTuneReference({ bookId, tuneId: ref });
            if (entry) {
                this.tune = this.index.getAbc(entry);
                if (entry.tags) {
                    this.allTags = entry.tags.join(', ');
                } else {
                    this.allTags = '';
                }
                const book = this.index.getBookById(bookId);
                this.prevRef = undefined;
                this.nextRef = undefined;
                const prevPos = entry.pos - 1;
                if (prevPos >= 0) {
                    this.prevRef = book.tuneBook.tunes[prevPos].id
                }
                const nextPos = entry.pos + 1;
                if (nextPos < book.tuneBook.tunes.length) {
                    this.nextRef = book.tuneBook.tunes[nextPos].id;
                }
                
                // Find containing sets and repertoires
                await this.findContainingSetsAndRepertoires(bookId, ref);
            }
        }
    }

    private async findContainingSetsAndRepertoires(bookId: string, tuneId: string): Promise<void> {
        this.containingSets = [];
        this.containingRepertoires = [];
        
        if (!this.signedIn) {
            return;
        }

        // Find tune sets containing this tune
        const setsCollection = await this.tuneSetRepository.load();
        this.containingSets = setsCollection.sets.filter(set => 
            set.tunes.some(tune => tune.bookId === bookId && tune.tuneId === tuneId)
        );

        // Find repertoires containing this tune
        const repertoireCollection = await this.repertoireRepository.load();
        this.containingRepertoires = repertoireCollection.repertoires.filter(rep =>
            rep.items.some(item => item.tune.bookId === bookId && item.tune.tuneId === tuneId)
        );
    }
}
