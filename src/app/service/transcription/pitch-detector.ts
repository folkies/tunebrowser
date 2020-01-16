export class PitchDetector {
    
    static mikelsFrequency(fftMag: number[], sampleRate: number, frameSize: number): number {
        let frequency = 0;
        let pitchPeek = 2;

        let peaks = PitchDetector.calculatePeaks(fftMag, pitchPeek, fftMag.length, 0);

        peaks.sort((a, b) => fftMag[b] - fftMag[a]);

        const NUM_CANDIDATES = 5;
        const NUM_HARMONICS = 10;
        let maxEnergy = 0;
        let maxCandidate = 0;
        let binWidth = sampleRate / frameSize;

        for (let i = 0; i < NUM_CANDIDATES; i++) {
            let candidate = peaks[i];
            let energy = 0;

            for (let j = 0; j < NUM_HARMONICS; j++) {
                let harmonic = candidate + (j * candidate);
                let hLow = harmonic - 2;
                let hHigh = harmonic + 2;
                let maxLittleBit = -1;

                for (let k = hLow; k <= hHigh; k++) {
                    if (k < fftMag.length) {
                        if (fftMag[k] > maxLittleBit) {
                            maxLittleBit = fftMag[k];
                        }
                    }
                }

                energy += maxLittleBit;
            }

            if (energy > maxEnergy) {
                maxEnergy = energy;
                maxCandidate = candidate;
            }
        }

        frequency = maxCandidate * binWidth;
        return frequency;
    }

    private static calculatePeaks(data: number[], border: number, howFar: number, thresholdNormal: number): number[] {
        let thresholdValue = 0;

        if (thresholdNormal > 0) {
            for (let i = 0; i < howFar; i++) {
                if (data[i] > thresholdValue) {
                    thresholdValue = data[i];
                }
            }
        }

        thresholdValue *= thresholdNormal;
        let peaks = [];

        if (howFar >= border) {
            for (let i = border; i < howFar - border; i++) {
                let addPeak = true;

                if (data[i] >= thresholdValue) {
                    for (let j = 0; j < border; j++) {
                        if (data[i] < data[i - j] || data[i] < data[i + j]) {
                            addPeak = false;
                            break;
                        }
                    }
                }
                else {
                    addPeak = false;
                }

                if (addPeak) {
                    peaks.push(i);
                }
            }
        }

        return peaks;
    }
}
