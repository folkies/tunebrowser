import { Injectable } from '@angular/core';
import { Repertoire, RepertoireCollection, TuneReference, RepertoireItem } from '../model/repertoire';
import { GoogleDriveService } from './google-drive.service';

const TUNE_FOLDER = 'Tune Browser';
const REPERTOIRE_COLLECTION = 'repertoire-collection.json';
export const INTERVALS : number[] = [ 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 6, 6, 15 ];

export function reviveRepertoireItem(key: string, value: any): any {
    if (key === "added" || key === "due") {
        return new Date(value);
    }
    if (key === "practiceHistory") {
        return (value as string[]).map(date => new Date(date));
    }
    if (key === "items") {
        return (value as any[]).map(item => new RepertoireItemImpl(item.tune, item.added, item.practiceHistory));
    }
    return value;
}

export class RepertoireItemImpl implements RepertoireItem {
    due?: Date;

    constructor(public tune: TuneReference, public added: Date, public practiceHistory: Date[]) {
    }

    numPracticed(): number {
        return this.practiceHistory.length;
    }

    lastPracticed(): Date {
        if (this.practiceHistory.length == 0) {
            return undefined;
        }
        return this.practiceHistory[this.practiceHistory.length - 1];
    }

    practicedOn(date: Date): void {
        this.practiceHistory.push(date);
        if (this.practiceHistory.length > INTERVALS.length) {
            this.practiceHistory.splice(0, this.practiceHistory.length - INTERVALS.length);
        }
    }

    referencedBy(ref: TuneReference): boolean {
        if (!ref) {
            return false;
        }
        return this.tune.bookId == ref.bookId && this.tune.tuneId === ref.tuneId;
    }
}



@Injectable()
export class RepertoireRepository {
    collectionFileId: string;
    private repertoireCollection: RepertoireCollection;

    constructor(private googleDrive: GoogleDriveService) {

    }

    async load(): Promise<RepertoireCollection> {
        if (this.googleDrive.isSignedOut()) {
            return {repertoires: []};
        }

        if (this.repertoireCollection) {
            return this.repertoireCollection;
        }

        const folderId = await this.googleDrive.findOrCreateFolder(TUNE_FOLDER);
        const fileRefs = await this.googleDrive.listTextFiles(folderId);
        const collectionRef = fileRefs.find(ref => ref.name === REPERTOIRE_COLLECTION);
        let collectionJson: string;
        if (collectionRef === undefined) {
            collectionJson = '{"repertoires": [{"id": "Default", "instrument": "Default", "items":[], "maxAge": 30, "numTunesPerSession": 10}]}';
            this.collectionFileId = await this.googleDrive.createTextFile(REPERTOIRE_COLLECTION, collectionJson);
        } else {
            this.collectionFileId = collectionRef.id;
            collectionJson = await this.googleDrive.getTextFile(collectionRef.id);
        }

        this.repertoireCollection = JSON.parse(collectionJson, reviveRepertoireItem);
        return this.repertoireCollection;
    }

    async saveCollection(repertoireCollection: RepertoireCollection): Promise<string> {
        return this.googleDrive.updateTextFile(this.collectionFileId, JSON.stringify(repertoireCollection));
    }

    async save(): Promise<string> {
        if (this.repertoireCollection) {
            return this.saveCollection(this.repertoireCollection);
        }
        return "";
    }

    async addRepertoireItem(tuneRef: TuneReference, added: Date, repertoireId?: string): Promise<string> {
        const collection = await this.load();
        const repertoire = await this.findRepertoire(repertoireId);
        const item = repertoire.items.find(item => item.referencedBy(tuneRef));
        if (item) {
            item.added = added;
        } else {
            repertoire.items.push(new RepertoireItemImpl(tuneRef, added, []));
        }
        return this.saveCollection(collection);
    }

    async findRepertoire(repertoireId?: string): Promise<Repertoire> {
        const collection = await this.load();
        return (repertoireId)
            ? collection.repertoires.find(r => r.id === repertoireId)
            : collection.repertoires[0];
    }
}