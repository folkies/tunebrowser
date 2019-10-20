import { Injectable } from '@angular/core';
import { TuneBook } from 'abcjs/midi';
import { TuneBookCollection, TuneBookDescriptor } from "../model/tunebook-collection";
import { TuneBookReference } from '../model/tunebook-reference';
import { GoogleDriveService } from './google-drive.service';
import { Loader } from './loader';

const TUNE_FOLDER = 'Tune Browser';
const TUNEBOOK_COLLECTION = 'tunebook-collection.json';

@Injectable()
export class GoogleDriveTunebookLoaderService implements Loader {

    private collectionFileId: string;

    constructor(private googleDrive: GoogleDriveService) {
    }

    /**
     * Loads the tunebook from the given path.
     * @param path path relative to the `assets` folder.
     * @returns parsed tunebook
     */
    async loadTuneBook(descriptor: TuneBookDescriptor): Promise<TuneBookReference> {
        const abc = await this.googleDrive.getTextFile(descriptor.uri);
        const tuneBook = new TuneBook(abc);
        return new TuneBookReference(tuneBook, descriptor, abc);
    }

    /**
     * Loads the tunebook collection manifest with metadata for all tunebooks.
     * @returns tunebook collection manifest
     */
    async loadTuneBookCollection(): Promise<TuneBookCollection> {
        if (this.googleDrive.isSignedOut()) {
            return {books: []};
        }
        const folderId = await this.googleDrive.findOrCreateFolder(TUNE_FOLDER);
        const fileRefs = await this.googleDrive.listTextFiles(folderId);
        const collectionRef = fileRefs.find(ref => ref.name === TUNEBOOK_COLLECTION);
        let collectionJson: string;
        if (collectionRef === undefined) {
            collectionJson = '{"books": []}';
            this.collectionFileId = await this.googleDrive.createTextFile(TUNEBOOK_COLLECTION, collectionJson);
        } else {
            this.collectionFileId = collectionRef.id;
            collectionJson = await this.googleDrive.getTextFile(collectionRef.id);
        }

        return JSON.parse(collectionJson);
    }

    async updateTuneBookCollection(collection: TuneBookCollection): Promise<string> {
        return this.googleDrive.updateTextFile(this.collectionFileId, JSON.stringify(collection));
    }
}