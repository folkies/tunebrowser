import { getLogger, Logger } from '@log4js2/core';
import fs from 'fs';
import { TuneMatcher } from "./tune-matcher-impl";

describe('TuneMatcher', () => {
    let log: Logger = getLogger('TuneMatcherSpec');
    let d : number[][] = new Array(2);

    const MAX = 1000;
    for (let i = 0; i < 2; i++) {
        const row: number[] = new Array<number>(MAX);
        row.fill(0);
        d[i] = row;
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