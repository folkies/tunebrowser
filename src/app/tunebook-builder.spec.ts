import fs from 'fs';
import { TuneBookBuilder } from './tunebook-builder';

const inputDir = '/home/hwellmann/tmp/tunes';

describe('Tunebook builder', () => {
    let builder: TuneBookBuilder;

    beforeEach(() => {
        builder = new TuneBookBuilder(inputDir);
    });

    test('should parse reference with suffix', () => {
        const ref = builder.toReference('123a');
        expect(ref.numeric).toBe(123);
        expect(ref.suffix).toBe('a');
    });

    test('should parse reference without suffix', () => {
        const ref = builder.toReference('152');
        expect(ref.numeric).toBe(152);
        expect(ref.suffix).toBe('');
    });

    test('should compare references', () => {
        expect(builder.referenceCompare('6', '12')).toBeLessThan(0);
        expect(builder.referenceCompare('60', '12')).toBeGreaterThan(0);
        expect(builder.referenceCompare('12', '12')).toBe(0);
        expect(builder.referenceCompare('12', '12a')).toBeLessThan(0);
        expect(builder.referenceCompare('12b', '12a')).toBeGreaterThan(0);
    });

    test('should build tunebook', () => {
        const files = fs.readdirSync(inputDir);
        files.forEach(f => builder.processFile(f));

        const sortedMap = new Map([...builder.tuneMap].sort((left, right) => builder.referenceCompare(left[0], right[0])));
        const text = Array.from(sortedMap.values()).join('\n\n');
        fs.writeFileSync('mytunebook.abc', text);
    });
});
