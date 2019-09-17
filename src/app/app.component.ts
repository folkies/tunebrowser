import { Component } from '@angular/core';
import abcjs from 'abcjs';
import { SearchService } from './search.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'folkies';
    rawAbc: string;
    query: string;

    constructor(private searchService: SearchService) {

    }

    get abcText(): string {
        return this.rawAbc;
    }

    set abcText(text: string) {
        this.rawAbc = text;
        console.log('new text: ' + this.rawAbc);
        abcjs.renderAbc('notation', this.rawAbc);
    }

    findTunes(): void {
        const tunes = this.searchService.findTunes(this.query);
        if (tunes.length > 0) {
            abcjs.renderAbc('notation', tunes[0].abc);
        }
    }
}
