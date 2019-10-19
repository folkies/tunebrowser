import { TuneBookDescriptor } from "./tunebook-collection";
import { TuneBook } from 'abcjs/midi';

export class TuneBookReference {
    constructor(public tuneBook: TuneBook, public descriptor: TuneBookDescriptor, public abc: string) {        
    }
}