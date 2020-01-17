import { getLogger, Logger } from '@log4js2/core';
import { NormalizedTune } from '../../model/normalized-tune';
import { minEditDistance } from './edit-distance';

export class TuneMatcher {
    
    private d: number[][] = [];

    private readonly log: Logger = getLogger('TuneMatcher');

    constructor(private normalizedTunes: NormalizedTune[]) {

        const MAX = 1000;
        for (let i = 0; i < 2; i++) {
            const row: number[] = [];
            for (let j = 0; j < MAX; j++) {
                row.push(0);
            }
            this.d.push(row);
        }
    }

    findBestMatches(query: string): NormalizedTune[] {
        let numTunes = 0;
        let results: NormalizedTune[] = [];
        for (let tune of this.normalizedTunes) {
            tune.ed = minEditDistance(query, tune.normalized, this.d);
            tune.confidence = 1.0 - (tune.ed / query.length);

            results.push(tune);
            numTunes++;
            if (numTunes % 1000 === 0) {
                this.log.info(`${numTunes} tunes`);
            }
        }
        results.sort((left, right) => left.ed - right.ed);
        const topHits = [];
        let tuneId = '';
        for (let tune of results) {
            if (tune.tune !== tuneId) {
                tuneId = tune.tune;
                topHits.push(tune);
                if (topHits.length === 10) {
                    break;
                }
            }
        }

        return topHits;
    }
}