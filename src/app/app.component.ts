import { Component } from '@angular/core';
import abcjs from 'abcjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'folkies';
    rawAbc: string;

    get abcText(): string {
        return this.rawAbc;
    }

    set abcText(text: string) {
        this.rawAbc = text;
        console.log('new text: ' + this.rawAbc);
        abcjs.renderAbc('notation', this.rawAbc);
    }
}
