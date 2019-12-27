import { TuneBook } from 'abcjs/midi';
import { addDays } from 'date-fns';
import fs from 'fs';
import { Repertoire, RepertoireItem, TuneReference } from '../model/repertoire';
import { titleQuery } from '../model/tune-query';
import { TuneBookCollection, TuneBookDescriptor } from '../model/tunebook-collection';
import { TuneBookReference } from '../model/tunebook-reference';
import { PracticeService  } from './practice-service';
import { reviveRepertoire, RepertoireItemImpl } from './repertoire-repository';
import { TuneBookIndex } from './tunebook-index';

function addTune(repertoire: Repertoire, name: string, added: string, practiced?: string) {
    const ref: TuneReference = { bookId: 'unknown', tuneId: name };
    const item = new RepertoireItemImpl(ref, new Date(added), []);
    if (practiced) {
        item.practicedOn(new Date(practiced));
    }
    repertoire.items.push(item);
}

function showSessionForDate(repertoire: Repertoire, date: Date): void {
    let practiceService = new PracticeService();
    let output = date.toString() + '\n';
    const session = practiceService.buildPracticeAssignment(repertoire, date);
    session.forEach(item => output += item.tune.tuneId + '\n');
    practiceService.markAsPracticed(session, date);
    console.log(output);
}

function resolveSessionForDate(repertoire: Repertoire, date: Date, index: TuneBookIndex): void {
    let practiceService = new PracticeService();
    let output = date.toString() + '\n';
    const session = practiceService.buildPracticeAssignment(repertoire, date);
    session.forEach(item => output += findTitle(item, index) + '\n');
    practiceService.markAsPracticed(session, date);
    console.log(output);
}

function findTitle(item: RepertoireItem, index: TuneBookIndex): string {
    const entry = index.findEntryByTuneReference(item.tune);
    return entry ? entry.title : "unknown";
}

function buildIndex(): TuneBookIndex {
    const json = fs.readFileSync(`src/assets/tunebooks.json`, 'utf8');
    const collection: TuneBookCollection = JSON.parse(json);
    const index = new TuneBookIndex();
    [0, 1, 2].forEach(i => index.addTuneBook(loadTuneBook(collection.books[i])));
    return index;
}

function loadTuneBook(descriptor: TuneBookDescriptor): TuneBookReference {
    const abc = fs.readFileSync(`src/assets/${descriptor.uri}`, 'utf8');
    const tuneBook = new TuneBook(abc);
    return new TuneBookReference(tuneBook, descriptor, abc);
}

function updateFromIndex(item: RepertoireItem, index: TuneBookIndex) {
    const name = item.tune.tuneId;
    const entries = index.findTunes(titleQuery(name));
    if (entries.length === 1) {
        item.tune.bookId = entries[0].book;
        item.tune.tuneId = entries[0].id;
    }
}

describe('PracticeService', () => {
    let repertoire: Repertoire = {
        id: '1',
        instrument: 'Flute',
        items: [],
        maxAge: 30,
        numTunesPerAssignment: 10 
    };

    let practiceService = new PracticeService();

    beforeEach(() => {
        const json = fs.readFileSync('test/assets/playlist.json', 'utf8');
        const playlist = JSON.parse(json);
        playlist.data.forEach(item => addTune(repertoire, item.Title, item.Learned, item.Practiced));
    });

    test('should get session', () => {
        for (let days = 0; days < 21; days++) {
            let date = new Date("2019-12-27")
            date = addDays(date, days);
            showSessionForDate(repertoire, date);
        }
    });

    test('should build repertoire', () => {
        const index = buildIndex();
        repertoire.items.forEach(item => updateFromIndex(item, index));
        console.log(JSON.stringify(repertoire, null, 2));
    });

    test('should verify repertoire', () => {
        const json = fs.readFileSync('test/assets/repertoire.json', 'utf8');
        const myRepertoire: Repertoire = JSON.parse(json, reviveRepertoire);
        const index = buildIndex();
        let rep = []
        myRepertoire.items.forEach(item => {
            if (item.tune.bookId !== 'rover2') {
                const entry = index.findEntryByTuneReference(item.tune);
                rep.push(entry.title);
                expect(entry).toBeDefined();
                expect(entry.book).toBe(item.tune.bookId);
                expect(entry.id).toBe(item.tune.tuneId);
            }
        });
        console.log(rep.sort().join('\n'));
    });

    test('should build sessions from repertoire', () => {
        const index = buildIndex();
        const json = fs.readFileSync('test/assets/repertoire.json', 'utf8');
        const myRepertoire: Repertoire = JSON.parse(json, reviveRepertoire);
        for (let days = 0; days < 21; days++) {
            let date = new Date("2019-12-27")
            date = addDays(date, days);
            resolveSessionForDate(myRepertoire, date, index);
        }
    });
});
