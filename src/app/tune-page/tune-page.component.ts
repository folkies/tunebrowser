import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TuneBookIndex } from '../tunebook-index';

@Component({
    selector: 'app-tune-page',
    templateUrl: './tune-page.component.html'
})
export class TunePageComponent implements OnInit {

    tune = '';

    private ref: string;

    constructor(private index: TuneBookIndex, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.paramMap.subscribe(map => this.consumeRef(map));
        this.index.tuneBookReady.subscribe(() => {
            this.displayTune();
        });
    }

    private consumeRef(map: ParamMap): void {
        this.ref = map.get('ref');
        this.displayTune();
    }

    private displayTune(): void {
        if (this.ref !== undefined && this.index.isReady()) {
            const tunes = this.index.findTunes(this.ref);
            if (tunes.length === 1) {
                this.tune = tunes[0].abc;
            }
        }
    }
}
