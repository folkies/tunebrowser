import fs from 'fs';
import { TuneBookBuilder } from './tunebook-builder';

const singleFileDir = '/home/hwellmann/tmp/tunes';
const bookDir = '/home/hwellmann/tmp/ds';

describe('TuneBookBuilder', () => {
    let builder: TuneBookBuilder;

    beforeEach(() => {
        builder = new TuneBookBuilder();
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

    test('should build tunebook from single files', () => {
        const files = fs.readdirSync(singleFileDir);
        files.forEach(f => builder.processSingleFile(`${singleFileDir}/${f}`));

        fs.writeFileSync('bookFromSingleFiles.abc', builder.buildSortedBook());
    });

    test('should build tunebook from books', () => {
        const files = fs.readdirSync(bookDir);
        files.forEach(f => builder.processBookFile(`${bookDir}/${f}`));

        fs.writeFileSync('bookFromBooks.abc', builder.buildSortedBook());
    });
});
