import { Injectable } from '@angular/core';
import { getLogger, Logger } from '@log4js2/core';
import { GoogleApiLoaderService } from 'src/lib/ngx-gapi-auth2';
import Mutex from 'ts-mutex';
import { MultiPartBuilder } from './multipart-builder';

const TUNE_FOLDER = 'Tune Browser';

const lock = new Mutex();

export interface FileReference {
    id: string;
    name: string;
}

@Injectable()
export class GoogleDriveService {

    private log: Logger = getLogger('GoogleDriveService');

    private googleAuth: gapi.auth2.GoogleAuth;

    private initialized = false;

    constructor(private googleApi: GoogleApiLoaderService) {
    }


    private initialize(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.initClient()
                .then(() => resolve(true))
                .catch(reason => reject(reason));
        });
    }

    private loadGoogleClient(): Promise<void> {
        return new Promise((resolve) => {
                gapi.load('client', () =>  resolve());
        });
    }

    private async initClient(): Promise<void> {
        await this.googleApi.onLoad().toPromise();
        await this.loadGoogleClient();
        await gapi.client.load('drive', 'v3');
        this.googleAuth = gapi.auth2.getAuthInstance();
        const user = this.googleAuth.currentUser.get();
        this.log.debug('Google API client initialized');

        if (user.getId() === null) {
        } else {
            this.log.debug("user id = " + user.getId());
            this.log.debug("isSignedIn = " + this.googleAuth.isSignedIn.get());
        }
    }

    private async ensureInitializedExclusive(): Promise<boolean> {
        if (!this.initialized) {
            this.initialized = await this.initialize();
        }
        return this.initialized;
    }

    private ensureInitialized(): Promise<boolean> {
        return lock.use(() => this.ensureInitializedExclusive() );
    }

    private isSignedIn(): boolean {
        if (!this.googleAuth) {
            return false;
        }
        const user = this.googleAuth.currentUser.get();
        if (!user) {
            return false;
        }
        return user.isSignedIn();
    }

    async isDefinitelySignedOut(): Promise<boolean> {
        await this.ensureInitialized();
        return this.googleAuth && !this.googleAuth.isSignedIn.get();
    }

    async createTextFile(fileName: string, content: string): Promise<string> {
        await this.ensureInitialized();
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
        await this.ensureInitialized();
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
        await this.ensureInitialized();
        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media'
        });
        return response.body;
    }

    async listTextFiles(folderId: string): Promise<FileReference[]> {
        await this.ensureInitialized();
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
        await this.ensureInitialized();
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
        await this.ensureInitialized();
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