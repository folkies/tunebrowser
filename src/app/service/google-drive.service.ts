import { Injectable } from '@angular/core';
import { getLogger, Logger } from '@log4js2/core';
import { ReplaySubject } from 'rxjs';
import { GoogleApiLoaderService, GoogleAuthService } from '../../lib/google-sign-in';
import { MultiPartBuilder } from './multipart-builder';

const TUNE_FOLDER = 'Tune Browser';

export interface FileReference {
    id: string;
    name: string;
}

@Injectable()
export class GoogleDriveService {

    readonly driveApiLoaded = new ReplaySubject<boolean>(1);

    private log: Logger = getLogger('GoogleDriveService');

    private signedIn: boolean;

    constructor(private googleApiLoader: GoogleApiLoaderService,
        private googleAuth: GoogleAuthService) {
        this.googleAuth.authState.subscribe(auth => {
            this.signedIn = !!auth;
        });

        this.googleApiLoader.onClientLoaded().subscribe(_ => {
            gapi.client.load('drive', 'v3').then(() => {
                this.log.info('Google Drive client initialized');
                this.driveApiLoaded.next(true);
                this.driveApiLoaded.complete();
            });
        });
    }

    private isSignedIn(): boolean {
        return this.signedIn;
    }


    async isDefinitelySignedOut(): Promise<boolean> {
        return !this.isSignedIn();
    }

    async createTextFile(fileName: string, content: string): Promise<string> {
        if (!this.isSignedIn()) {
            return undefined;
        }
        try {
            const folderId = await this.findOrCreateFolder(TUNE_FOLDER);

            const resource = {
                name: fileName,
                mimeType: 'text/plain',
                parents: [folderId]
            };

            const multipart = new MultiPartBuilder()
                .append('application/json', JSON.stringify(resource))
                .append('text/plain', content)
                .finish();

            const response = await gapi.client.request({
                path: '/upload/drive/v3/files',
                method: 'POST',
                params: {
                    uploadType: 'multipart'
                },
                headers: { 'Content-Type': multipart.type },
                body: multipart.body
            });
            this.log.info('Created file with id = {}', response.result.id);
            return response.result.id;
        }
        catch (error) {
            this.log.error('Error creating file', error);
            return null;
        }
    }

    async updateTextFile(fileId: string, content: string): Promise<string> {
        if (!this.isSignedIn()) {
            return undefined;
        }
        try {
            const response = await gapi.client.request({
                path: '/upload/drive/v3/files/' + fileId,
                method: 'PATCH',
                params: {
                    uploadType: 'media'
                },
                headers: { 'Content-Type': 'text/plain' },
                body: content
            });
            if (response.status === 200) {
                this.log.info('Updated file with id = {}', response.result.id);
                return response.result.id;
            }
        }
        catch (error) {
            this.log.error('Error updating file', error);
        }
        return null;
    }

    async getTextFile(fileId: string): Promise<string> {
        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media'
        });
        return response.body;
    }

    async listTextFiles(folderId: string): Promise<FileReference[]> {
        if (!this.isSignedIn()) {
            return [];
        }
        const response = await gapi.client.drive.files.list({
            q: `'${folderId}' in parents`,
            pageSize: 100
        });
        return response.result.files.map(file => this.toRef(file));
    }

    private toRef(file: gapi.client.drive.File): FileReference {
        return { id: file.id, name: file.name };
    }

    async createFolder(folderName: string): Promise<string> {
        const response = await gapi.client.drive.files.create({
            resource: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder'
            }
        });
        this.log.info(`Created folder ${folderName} with id = ${response.result.id}`);
        return response.result.id;
    }

    async findOrCreateFolder(folderName: string): Promise<string> {
        if (!this.isSignedIn()) {
            return undefined;
        }

        const response = await gapi.client.drive.files.list({
            q: `name = "${folderName}" and "root" in parents`
        });
        const files = response.result.files;
        if (files.length === 1) {
            return files[0].id;
        }
        const folderId = this.createFolder(folderName);
        return folderId;
    }
}