export class FuzzyHistogram {
    
    static calculatePeak(data: number[], fuzz: number, atLeast: number): number {
        let candidateLengths = [];

        for (let item of data) {
            let found = false;

            for (let j = 0; j < candidateLengths.length; j++) {
                let current = candidateLengths[j];
                let upper = current.value * (1.0 + fuzz);
                let lower = current.value * (1.0 - fuzz);

                if (item >= lower && item <= upper) {
                    found = true;
                    current.count += 2;
                    current.value = (current.value * (current.count - 1) + item) / current.count;
                    candidateLengths[j] = current;
                    break;
                }
            }

            if (!found) {
                candidateLengths.push({
                    value: item,
                    count: 1,
                });
            }
        }

        candidateLengths.sort((a, b) => b.count - a.count);

        for (let candidate of candidateLengths) {
            let duration = candidate.value;
            if (duration >= atLeast) {
                return duration;
            }
        }

        return atLeast;
    }
}
