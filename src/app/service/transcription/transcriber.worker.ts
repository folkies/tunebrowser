import { expose } from 'comlink';
import FftTranscriber, { TranscriptionResult } from './fft-transcriber';
import { ITranscriber, PushResult, TranscriptionInitParams } from './transcription';

export class TranscriberImpl implements ITranscriber {
    private fftTranscriber: FftTranscriber;
    private signal: Float32Array[];

    initialize(initParams: TranscriptionInitParams): void {
        this.fftTranscriber = new FftTranscriber(initParams);
        this.resetSignal();
    }    
    
    private resetSignal() {
        this.signal = [];
    }
    
    transcribe(signal?: Float32Array, midi = false): TranscriptionResult {
        const transcription = this.fftTranscriber.transcribe(this.signal);
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