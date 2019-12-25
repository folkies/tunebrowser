import { Injectable } from '@angular/core';
import { GoogleDriveService } from './google-drive.service';
import { RepertoireCollection, TuneReference, referencedBy, Repertoire } from '../model/repertoire';
import { RepertoireItemImpl } from './practice-service';

const TUNE_FOLDER = 'Tune Browser';
const REPERTOIRE_COLLECTION = 'repertoire-collection.json';

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

        this.repertoireCollection = JSON.parse(collectionJson);
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
        const item = repertoire.items.find(item => referencedBy(item, tuneRef));
        if (item) {
            item.added = added;
        } else {
            repertoire.items.push(new RepertoireItemImpl(tuneRef, added));
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