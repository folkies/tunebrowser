import { TuneBookCollection, TuneBookDescriptor } from '../model/tunebook-collection';
import { TuneBookReference } from '../model/tunebook-reference';

export interface Loader {
    loadTuneBook(descriptor: TuneBookDescriptor): Promise<TuneBookReference>;
    loadTuneBookCollection(): Promise<TuneBookCollection>;
}