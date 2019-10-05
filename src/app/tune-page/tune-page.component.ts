import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TuneBookIndex } from '../tunebook-index';
import { TuneQuery } from '../tune-query';

@Component({
    selector: 'app-tune-page',
    templateUrl: './tune-page.component.html'
})
export class TunePageComponent implements OnInit {

    tune = '';

    private path: string;
    private ref: string;

    constructor(private index: TuneBookIndex, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.paramMap.subscribe(map => this.consumeRef(map));
        this.index.tuneBookReady.subscribe(() => {
            this.displayTune(this.path, this.ref);
        });
    }

    private consumeRef(map: ParamMap): void {
        this.ref = map.get('ref');
        this.path = map.get('path');        
        this.displayTune(this.path, this.ref);
    }

    private displayTune(path: string, ref: string): void {
        if (ref !== undefined && this.index.isReady()) {
            const tunes = this.index.findTunes(new TuneQuery(ref, [path]));
            if (tunes.length > 0) {
                this.tune = this.index.getAbc(tunes[0]);
            }
        }
    }
}
