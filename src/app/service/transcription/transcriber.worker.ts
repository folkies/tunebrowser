import { expose } from 'comlink';
import Transcriber, { TranscriptionResult } from './transcriber';
import { ITranscriber, PushResult, TranscriptionInitParams } from './transcription';

export class TranscriberImpl implements ITranscriber {
    private transcriber: Transcriber;
    private signal: Float32Array[];
    private currNumSamples: number;

    initialize(initParams: TranscriptionInitParams): void {
        this.transcriber = new Transcriber(initParams);
        this.resetSignal();
    }    
    
    private resetSignal() {
        this.signal = [];
        this.currNumSamples = 0;
    }
    
    private mergeSignal() {
        let length = this.transcriber.numInputSamples;
        let signal = new Float32Array(length);
        let currNumSamples = 0;

        for (let buffer of this.signal) {
            let newNumSamples = currNumSamples + buffer.length;

            if (newNumSamples <= length) {
                signal.set(buffer, currNumSamples);
            }
            else {
                signal.set(buffer.subarray(0, length - currNumSamples), currNumSamples);
            }

            currNumSamples = newNumSamples;
        }

        return signal;
    }

    transcribe(signal?: Float32Array, midi: boolean = false): TranscriptionResult {
        let theSignal = signal ? signal : this.mergeSignal();

        let transcription = this.transcriber.transcribe(theSignal, midi);
        console.log(`Worker: transcription: ${transcription}`);

        const resultMsg = {
            transcription: transcription,
            sampleRate: this.transcriber.outputSampleRate,
            numSamples: this.transcriber.numOutputSamples,
        };


        return resultMsg;
    }

    pushSignal(signal: Float32Array): PushResult {
        this.signal.push(signal);
        this.currNumSamples += signal.length;

        let largest = Number.MIN_VALUE;

        for (let sample of signal) {
            if (sample > largest) largest = sample;
        }

        return {
            amplitude: largest,
            timeRecorded: this.currNumSamples / this.transcriber.inputSampleRate,
            isBufferFull: this.currNumSamples >= this.transcriber.numInputSamples,
        };
    }
}

const transcriber = new TranscriberImpl();

expose(transcriber);