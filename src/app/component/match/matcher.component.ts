import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { proxy } from 'comlink';
import { NormalizedTune } from 'src/app/model/normalized-tune';
import { TuneMatcherProvider } from 'src/app/service/matching/tune-matcher-provider';

@Component({
    selector: 'matcher',
    templateUrl: './matcher.component.html'
})
export class MatcherComponent {

    tunes: NormalizedTune[];

    progress: number;

    constructor(
        private route: ActivatedRoute,
        private tuneMatcherProvider: TuneMatcherProvider) {
        this.route.paramMap.subscribe(map => this.matchTranscription(map));
    }

    private async matchTranscription(map: ParamMap): Promise<void> {
        const notes = map.get('transcription');
        const tuneMatcher = await this.tuneMatcherProvider.tuneMatcher();
        this.tunes = await tuneMatcher.findBestMatches(notes, proxy((percentage: number) => this.progress = percentage));
    }

    confidencePercentage(tune: NormalizedTune): number {
        return Math.round(tune.confidence * 100);
    }
}
