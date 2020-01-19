import { NormalizedTune } from 'src/app/model/normalized-tune';

export interface ITuneMatcher {
    
    setCorpus(json: string): void;
    setProgressCallback(progress: (percentage: number) => void): void;
    findBestMatches(query: string): NormalizedTune[];
}