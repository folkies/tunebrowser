import { Component, OnInit } from '@angular/core';
import { TuneBookIndex } from './tunebook-index';
import { TuneBookLoaderService } from './tunebook-loader.service';
import { TuneBookReference } from './tunebook-reference';
import { TuneBookDescriptor } from './tunebook-collection';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'folkies';

    constructor(private tuneBookLoaderService: TuneBookLoaderService, private tuneBookIndex: TuneBookIndex) {

    }

    async ngOnInit(): Promise<void> {
        const tuneBookCollection = await this.tuneBookLoaderService.loadTuneBookCollection();
        tuneBookCollection.books.forEach(descriptor => this.addBookToIndex(descriptor));
    }

    private addBookToIndex(descriptor: TuneBookDescriptor): void {
        this.tuneBookLoaderService.loadTuneBook(descriptor.path)
            .then(tuneBook => this.tuneBookIndex.addTuneBook(new TuneBookReference(tuneBook, descriptor)));
    }

}
