import { Injectable } from '@angular/core';
import { TuneBook } from 'abcjs/midi';
import { TuneBookCollection, TuneBookDescriptor } from "../model/tunebook-collection";
import { FileReference, GoogleDriveService } from './google-drive.service';
import { Loader } from './loader';
import { TuneBookReference } from '../model/tunebook-reference';

const TUNE_FOLDER = 'Tune Browser';


@Injectable()
export class GoogleDriveTunebookLoaderService implements Loader {
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
        return { books: fileRefs.map(fileRef => this.toDescriptor(fileRef)) };
    }

    private toDescriptor(fileRef: FileReference): TuneBookDescriptor {
        return {
            description: 'Private tunebook from Google Drive',
            id: fileRef.name,
            name: fileRef.name.replace('\.abc', ''),
            uri: fileRef.id,
            status: 'loading',
            storage: 'googledrive'
        };
    }
}