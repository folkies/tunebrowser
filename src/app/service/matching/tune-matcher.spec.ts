import fs from 'fs';
import { TuneMatcher } from "./tune-matcher";
import { Logger, getLogger } from '@log4js2/core';
import { NormalizedTune } from 'src/app/model/normalized-tune';

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
        const tunes: NormalizedTune[] = JSON.parse(json);
        log.info('parsed JSON');
        const matcher = new TuneMatcher(tunes);

        const matches = matcher.findBestMatches('CEGFGEDDCDDDADDFAAFADFAAAFFGAGDGEDCDEGGFGAFDDFEDDCEBBCCEDCEFGEDCDDDEDFAAFADFAEAFGADGEDD');
        matches.forEach(match => log.info(`${match.ed} ${match.name}`));
    });
});