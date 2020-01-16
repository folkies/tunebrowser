export interface TranscriptionResult {
    transcription: string;
    sampleRate: number;
    numSamples: number;
};

export interface PushResult {
    amplitude: number;
    timeRecorded: number;
    isBufferFull: boolean;
}

export interface TranscriptionInitParams {
    inputSampleRate?: number;
    sampleTime?: number;
    fundamental?: string;
    enableSampleRateConversion?: boolean;
    blankTime?: number;
    frameSize?: number;
    onProgress?: (x: number) => void;
};


export interface ITranscriber {
    initialize(initParams: TranscriptionInitParams): void;
    transcribe(signal?: Float32Array, midi?: boolean): TranscriptionResult; 
    pushSignal(signal: Float32Array): PushResult;
}
