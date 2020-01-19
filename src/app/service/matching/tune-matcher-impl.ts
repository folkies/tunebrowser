import { NormalizedTune } from '../../model/normalized-tune';
import { minEditDistance } from './edit-distance';
import { ITuneMatcher } from './tune-matcher';
import { Logger, getLogger, configure, LogLevel } from '@log4js2/core';

export class TuneMatcher implements ITuneMatcher {
    
    private readonly log: Logger = getLogger('TuneMatcher');
    
    private progress: (percentage: number) => void;

    private normalizedTunes: NormalizedTune[];

    private d: number[][] = new Array(2);

    constructor() {

        const MAX = 1000;
        for (let i = 0; i < 2; i++) {
            const row: number[] = new Array<number>(MAX);
            row.fill(0);
            this.d[i] = row;
        }
    }

    setCorpus(json: string): void {
        this.normalizedTunes = JSON.parse(json);
    }

    setProgressCallback(progress: (percentage: number) => void): void {
        this.progress = progress;
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
                const progressPercentage = 100 * numTunes / this.normalizedTunes.length;
                this.progress(progressPercentage);
                this.log.debug('examined tunes: {} %', progressPercentage);
            }
        }
        this.progress(100);
        
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
