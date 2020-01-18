import { getLogger, Logger } from '@log4js2/core';
import { expose } from 'comlink';
import { NormalizedTune } from '../../model/normalized-tune';
import { minEditDistance } from './edit-distance';
import { ITuneMatcher } from './tune-matcher';

export class TuneMatcher implements ITuneMatcher {
    
    private readonly log: Logger = getLogger('TuneMatcher');

    private normalizedTunes: NormalizedTune[];

    private d: number[][] = [];

    constructor() {

        const MAX = 1000;
        for (let i = 0; i < 2; i++) {
            const row: number[] = [];
            for (let j = 0; j < MAX; j++) {
                row.push(0);
            }
            this.d.push(row);
        }
    }

    setCorpus(json: string): void {
        console.log("Typeof corpus : " + typeof json);
        this.normalizedTunes = JSON.parse(json);
    }

    findBestMatches(query: string, progress: (percentage: number) => void): NormalizedTune[] {
        console.log(query);
        console.log(progress);

        let numTunes = 0;
        let results: NormalizedTune[] = [];
        for (let tune of this.normalizedTunes) {
            tune.ed = minEditDistance(query, tune.normalized, this.d);
            tune.confidence = 1.0 - (tune.ed / query.length);

            results.push(tune);
            numTunes++;
            if (numTunes % 1000 === 0) {
                const progressPercentage = 100 * numTunes / this.normalizedTunes.length;
                progress(progressPercentage);
                this.log.debug('examined tunes: {} %', progressPercentage);
            }
        }
        progress(100);
        
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

const matcher = new TuneMatcher();

expose(matcher);