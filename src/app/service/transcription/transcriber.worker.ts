import { expose } from 'comlink';
import Transcriber from './transcriber';
import { ITranscriber, PushResult, TranscriptionInitParams, TranscriptionResult } from './transcription';

export class TranscriberImpl implements ITranscriber {
    private transcriber: Transcriber;
    private signal: Float32Array[];

    initialize(initParams: TranscriptionInitParams): void {
        this.transcriber = new Transcriber(initParams);
        this.resetSignal();
    }    
    
    private resetSignal() {
        this.signal = [];
    }
    
    transcribe(): TranscriptionResult {
        const transcription = this.transcriber.transcribe(this.signal);
        console.log(`Worker: transcription: ${transcription}`);

        const resultMsg = {
            transcription: transcription,
        };


        return resultMsg;
    }


    pushSignal(signal: Float32Array): PushResult {
        this.signal.push(signal);

        let largest = Number.MIN_VALUE;

        for (const sample of signal) {
            if (sample > largest) largest = sample;
        }

        return {
            amplitude: largest,
            timeRecorded:0,
            isBufferFull: false
        };
    }
}

const transcriber = new TranscriberImpl();

expose(transcriber);