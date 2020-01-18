import { NormalizedTune } from 'src/app/model/normalized-tune';

export interface ITuneMatcher {
    
    setCorpus(json: string): void;
    findBestMatches(query: string, progress: (percentage: number) => void): NormalizedTune[];
}