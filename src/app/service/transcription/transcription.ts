export interface TranscriptionResult {
    transcription: string;
    sampleRate?: number;
    numSamples?: number;
}

export interface PushResult {
    amplitude: number;
    timeRecorded: number;
    isBufferFull: boolean;
}

export interface TranscriptionInitParams {
    inputSampleRate?: number;
    sampleTime?: number;
    fundamental?: string;
    blankTime?: number;
    frameSize?: number;
    tickTime?: number;
}


export interface ITranscriber {
    initialize(initParams: TranscriptionInitParams): void;
    transcribe(): TranscriptionResult; 
    pushSignal(signal: Float32Array): PushResult;
}
