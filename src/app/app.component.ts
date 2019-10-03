import { Component, OnInit } from '@angular/core';
import { TuneBookIndex } from './tunebook-index';
import { TuneBookLoaderService } from './tunebook-loader.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'folkies';

    constructor(private tuneBookLoaderService: TuneBookLoaderService, private tuneBookIndex: TuneBookIndex) {

    }

    ngOnInit(): void {
        this.tuneBookLoaderService.loadTuneBook().then(tuneBook => this.tuneBookIndex.setTuneBook(tuneBook));
    }

}
