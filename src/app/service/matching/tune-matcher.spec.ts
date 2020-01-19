import { getLogger, Logger } from '@log4js2/core';
import fs from 'fs';
import { TuneMatcher } from "./tune-matcher.worker";

describe('TuneMatcher', () => {
    let log: Logger = getLogger('TuneMatcherSpec');
    let d : number[][] = [];

    const MAX = 1000;
    for (let i = 0; i < MAX; i++) {
        const row: number[] = [];
        for (let j= 0; j < MAX; j++) {
            row.push(0);
        }
        d.push(row);
    }
    
    test('should match tune', () => {
        log.info('loading JSON');
        const json = fs.readFileSync('src/assets/normalized-tunes.json', 'utf8');
        log.info('loaded JSON');
        const matcher = new TuneMatcher();
        matcher.setCorpus(json);
        matcher.setProgressCallback((x: number) => null);
        const matches = matcher.findBestMatches('CEGFGEDDCDDDADDFAAFADFAAAFFGAGDGEDCDEGGFGAFDDFEDDCEBBCCEDCEFGEDCDDDEDFAAFADFAEAFGADGEDD');
        matches.forEach(match => log.info(`${match.ed} ${match.name}`));
    });
});