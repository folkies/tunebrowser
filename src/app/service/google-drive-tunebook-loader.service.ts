import { Injectable } from '@angular/core';
import { TuneBook } from 'abcjs/midi';
import { TuneBookCollection, TuneBookDescriptor } from "../model/tunebook-collection";
import { FileReference, GoogleDriveService } from './google-drive.service';
import { Loader } from './loader';

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
    async loadTuneBook(path: string): Promise<TuneBook> {
        const abc = await this.googleDrive.getTextFile(path);
        return new TuneBook(abc);
    }

    /**
     * Loads the tunebook collection manifest with metadata for all tunebooks.
     * @returns tunebook collection manifest
     */
    async loadTuneBookCollection(): Promise<TuneBookCollection> {
        const folderId = await this.googleDrive.findOrCreateFolder(TUNE_FOLDER);
        const fileRefs = await this.googleDrive.listTextFiles(folderId);
        return { books: fileRefs.map(fileRef => this.toDescriptor(fileRef)) };
    }

    private toDescriptor(fileRef: FileReference): TuneBookDescriptor {
        return {
            description: 'Private tunebook from Google Drive',
            id: fileRef.name,
            name: fileRef.name.replace('\.abc', ''),
            path: fileRef.id,
            status: 'loading',
            storage: 'googledrive'
        };
    }

}