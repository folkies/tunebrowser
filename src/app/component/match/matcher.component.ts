import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NormalizedTune } from 'src/app/model/normalized-tune';
import { titleWithoutNumber } from 'src/app/service/abc-util';
import { RestTuneMatcher } from 'src/app/service/matching/rest-tune-matcher';

@Component({
    selector: 'app-matcher',
    templateUrl: './matcher.component.html'
})
export class MatcherComponent {
    tunes: NormalizedTune[];

    constructor(
        private route: ActivatedRoute,
        private tuneMatcher: RestTuneMatcher) {
            this.route.paramMap.subscribe(map => this.matchTranscription(map));
        }

    private async matchTranscription(map: ParamMap): Promise<void> {
        const notes = map.get('transcription');
        this.tunes = await this.tuneMatcher.findBestMatches(notes);
    }

    confidencePercentage(tune: NormalizedTune): number {
        return Math.round(tune.confidence * 100);
    }

    title(tune: NormalizedTune): string {
        return titleWithoutNumber(tune.name);
    }

    getRhythmAndKey(tune: NormalizedTune): string {
        return `${tune.rhythm} in ${tune.key}`;
    }
}
