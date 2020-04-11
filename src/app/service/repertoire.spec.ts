import { reviveRepertoire } from "./repertoire-repository";
import { Repertoire } from '../model/repertoire';

describe('Repertoire', () => {

    test('should deserialize from legacy format', () => {
        const rep : Repertoire = JSON.parse('{"id": "foo", "instrument": "Recorder", "maxAge": 30, "numTunesPerAssignment": 8, "items": []}', reviveRepertoire);
        expect(rep.name).toBe('Recorder');
        expect(rep.maxAge).toBe(30);
        expect(rep.numTunesPerAssignment).toBe(8);
        expect(rep.items).toEqual([]);
        expect(rep['instrument']).toBeUndefined();
    });

});