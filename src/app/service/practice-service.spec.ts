import { addDays } from 'date-fns';
import fs from 'fs';
import { PracticeService, RepertoireItemImpl } from './practice-service';
import { Repertoire, TuneReference } from '../model/repertoire';


function addTune(repertoire: Repertoire, name: string, added: string, practiced?: string) {
    const ref: TuneReference = { bookId: 'learner', tuneId: name };
    const item = new RepertoireItemImpl(ref, new Date(added));
    if (practiced) {
        item.practicedOn(new Date(practiced));
    }
    repertoire.items.push(item);
}

function showSessionForDate(repertoire: Repertoire, date: Date): void {
    let practiceService = new PracticeService();
    let output = date.toString() + '\n';
    const session = practiceService.buildPracticeSession(repertoire, date);
    session.forEach(item => output += item.tune.tuneId + '\n');
    practiceService.markAsPracticed(session, date);
    console.log(output);
}

describe('PracticeService', () => {
    let repertoire: Repertoire = {
        id: '1',
        instrument: 'Flute',
        items: [],
        maxAge: 30,
        numTunesPerSession: 10 
    };

    let practiceService = new PracticeService();

    beforeEach(() => {
        const json = fs.readFileSync('test/assets/playlist.json', 'utf8');
        const playlist = JSON.parse(json);
        playlist.data.forEach(item => addTune(repertoire, item.Title, item.Learned, item.Practiced));
    });

    test('should get session', () => {
        for (let days = 0; days < 21; days++) {
            let date = new Date("2019-12-21")
            date = addDays(date, days);
            showSessionForDate(repertoire, date);
        }
    });
});
