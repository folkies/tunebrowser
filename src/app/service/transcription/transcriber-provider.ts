import { Injectable } from '@angular/core';
import { Remote, wrap } from 'comlink';
import { ITranscriber } from './transcription';

@Injectable()
export class TranscriberProvider {

    private instance: Remote<ITranscriber>; 

    transcriber(): Remote<ITranscriber> {
        if (! this.instance) {
            const worker =  new Worker(new URL('./transcriber.worker', import.meta.url), { name: 'transcriber', type: 'module' });
            this.instance = wrap<ITranscriber>(worker);
        }
        return this.instance;
    } 
}