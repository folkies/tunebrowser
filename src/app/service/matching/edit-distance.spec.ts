import { minEditDistance } from "./edit-distance";

describe('Edit distance', () => {
    let d: number[][] = [];

    const MAX = 1000;
    for (let i = 0; i < 2; i++) {
        const row: number[] = [];
        for (let j = 0; j < MAX; j++) {
            row.push(0);
        }
        d.push(row);
    }

    test('should get edit distance 1', () => {
        expect(minEditDistance("alter", "altar", d)).toBe(1);
    });

    test('should get edit distance 2', () => {
        expect(minEditDistance("Jagd", "Tatter Jack Walsh", d)).toBe(2);
    });

    test('should get edit distance 3', () => {
        expect(minEditDistance("CEGFGEDDCDDDADDFAAFADFAAAFFGAGDGEDCDEGGFGAFDDFEDDCEBBCCEDCEFGEDCDDDEDFAAFADFAEAFGADGEDD", "FFFDEDCABCDEDCAGFGADDEFGAFDGFEDCABCDEDCAGFGADCDDEFFFDEDCABCDEDCAGFGADDEFGAFDGFEDCABCDEDCAGFGADCDDADFAAFADFAAAFGGGGEDCDEFGGGAFDGFEDCABCDEDCAGFGADCDDADFAAFADFAAAFGGGGEDCDEFGGGAFDGFEDCABCDEDCAGFGADCDDAADCDDE", d)).toBe(24);
    });
});