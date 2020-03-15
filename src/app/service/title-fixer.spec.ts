import fs from 'fs';

describe('MetadataExtractor', () => {
    test('should strip numbers from titles', () => {
        const abc = fs.readFileSync('src/assets/LearnerSession.abc', 'utf8');
        const result = abc.replace(/^T:\s*\d+[a-z]?\s*/mg, 'T: ');
        console.info(result);
        fs.writeFileSync('src/assets/LearnerSession.abc', result);
    });
});
