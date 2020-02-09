import { Injectable } from '@angular/core';
import { Repertoire, RepertoireCollection, RepertoireItem, TuneReference } from '../model/repertoire';
import { GoogleDriveService } from './google-drive.service';

const TUNE_FOLDER = 'Tune Browser';
const REPERTOIRE_COLLECTION = 'repertoire-collection.json';
export const INTERVALS : number[] = [ 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3, 6, 6, 15 ];

/**
 * Repertoire reviver function for `JSON.parse()`.
 * @param key JSON key
 * @param value  JSON value
 * @return revived object with correct class
 */
export function reviveRepertoire(key: string, value: any): any {
    if (key === "added" || key === "due" || key === "lastPracticed") {
        return new Date(value);
    }
    if (key === "items") {
        return (value as any[]).map(item => new RepertoireItemImpl(item.tune, item.added, item.timesPracticed, item.lastPracticed));
    }
    return value;
}

export function replaceRepertoire(key: string, value: any): any {
    if (key === "due") {
        return undefined;
    }
    return value;
}

export class RepertoireItemImpl implements RepertoireItem {
    due?: Date;
    constructor(public tune: TuneReference, public added: Date, public timesPracticed: number, public lastPracticed?: Date) {
    }

    practicedOn(date: Date): void {
        this.lastPracticed = date;
        this.timesPracticed++;
    }

    referencedBy(ref: TuneReference): boolean {
        if (!ref) {
            return false;
        }
        return this.tune.bookId == ref.bookId && this.tune.tuneId === ref.tuneId;
    }
}

/**
 * Repository for repertoires. Used Google Drive as storage. The repository may contain multiple repertoires
 * for different instruments. The first repertoire is taken as default.
 */
@Injectable()
export class RepertoireRepository {
    /** Google Drive file identity of repertoire collection. */
    collectionFileId: string;

    currentAssignment: RepertoireItem[];

    /** Loaded repertoire collection. */
    private repertoireCollection: RepertoireCollection;

    constructor(private googleDrive: GoogleDriveService) {
    }

    /**
     * Loads all repertoires.
     * @return repertoire collection.
     */
    async load(): Promise<RepertoireCollection> {
        if (await this.googleDrive.isDefinitelySignedOut()) {
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
            collectionJson = '{"repertoires": [{"id": "Default", "instrument": "Default", "items":[], "maxAge": 30, "numTunesPerAssignment": 10}]}';
            this.collectionFileId = await this.googleDrive.createTextFile(REPERTOIRE_COLLECTION, collectionJson);
        } else {
            this.collectionFileId = collectionRef.id;
            collectionJson = await this.googleDrive.getTextFile(collectionRef.id);
        }

        this.repertoireCollection = JSON.parse(collectionJson, reviveRepertoire);
        return this.repertoireCollection;
    }

    /**
     * Saves given collection to predefined file.
     * @param repertoireCollection repertoire collection
     */
    async saveCollection(repertoireCollection: RepertoireCollection): Promise<string> {
        return this.googleDrive.updateTextFile(this.collectionFileId, JSON.stringify(repertoireCollection, replaceRepertoire));
    }

    /**
     * Saves the loaded collection to the predefined file. This is a no-op if the collection has not yet been loaded.
     * @param file identity
     */
    async save(): Promise<string> {
        if (this.repertoireCollection) {
            return this.saveCollection(this.repertoireCollection);
        }
        return null;
    }

    /**
     * Adds a tune to a repertoire.
     * @param tuneRef tune reference
     * @param added date added
     * @param repertoireId repertoire identity
     * @returns file identity
     */
    async addRepertoireItem(tuneRef: TuneReference, added: Date, repertoireId?: string): Promise<string> {
        const collection = await this.load();
        const repertoire = await this.findRepertoire(repertoireId);
        const item = repertoire.items.find(item => item.referencedBy(tuneRef));
        if (item) {
            item.added = added;
        } else {
            repertoire.items.push(new RepertoireItemImpl(tuneRef, added, 0));
        }
        return this.saveCollection(collection);
    }

    /**
     * Finds the repertoire with the given identity.
     * @param repertoireId repertoire identity (if empty, the first collection item will be returned)
     */
    async findRepertoire(repertoireId?: string): Promise<Repertoire> {
        const collection = await this.load();
        return (repertoireId)
            ? collection.repertoires.find(r => r.id === repertoireId)
            : collection.repertoires[0];
    }

}