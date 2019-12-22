import { Injectable } from '@angular/core';
import { GoogleDriveService } from './google-drive.service';
import { RepertoireCollection } from '../model/repertoire';

const TUNE_FOLDER = 'Tune Browser';
const REPERTOIRE_COLLECTION = 'repertoire-collection.json';

@Injectable()
export class RepertoireRepository {
    collectionFileId: string;

    constructor(private googleDrive: GoogleDriveService) {

    }

    async load(): Promise<RepertoireCollection> {
        if (this.googleDrive.isSignedOut()) {
            return {repertoires: []};
        }
        const folderId = await this.googleDrive.findOrCreateFolder(TUNE_FOLDER);
        const fileRefs = await this.googleDrive.listTextFiles(folderId);
        const collectionRef = fileRefs.find(ref => ref.name === REPERTOIRE_COLLECTION);
        let collectionJson: string;
        if (collectionRef === undefined) {
            collectionJson = '{"repertoires": []}';
            this.collectionFileId = await this.googleDrive.createTextFile(REPERTOIRE_COLLECTION, collectionJson);
        } else {
            this.collectionFileId = collectionRef.id;
            collectionJson = await this.googleDrive.getTextFile(collectionRef.id);
        }

        return JSON.parse(collectionJson);
    }

    async save(repertoireCollection: RepertoireCollection): Promise<string> {
        return this.googleDrive.updateTextFile(this.collectionFileId, JSON.stringify(repertoireCollection));
    }
}