import fs from 'fs';

describe('TitleFixer', () => {
    test('should strip numbers from titles', () => {
        const abc = fs.readFileSync('src/assets/LearnerSession.abc', 'utf8');
        const result = abc.replace(/^T:\s*\d+[a-z]?\s*/mg, 'T: ');
        console.info(result);
        fs.writeFileSync('src/assets/LearnerSession.abc', result);
    });

    fit('should strip %%stretchlast', () => {
        const abc = fs.readFileSync('src/assets/LearnerSession.abc', 'utf8');
        const lines = abc.split('\n').filter(line => !line.includes('stretchlast'));
        const result = lines.join('\n');
        console.info(result);
        fs.writeFileSync('src/assets/LearnerSession.abc', result);
    });
});
