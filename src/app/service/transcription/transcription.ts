export interface TranscriptionResult {
    transcription: string;
}

export interface PushResult {
    numSamples: number;
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
