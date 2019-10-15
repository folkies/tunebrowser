import { TuneBook } from 'abcjs/midi';
import { TuneBookCollection } from '../model/tunebook-collection';

export interface Loader {
    loadTuneBook(path: string): Promise<TuneBook>;
    loadTuneBookCollection(): Promise<TuneBookCollection>;
}