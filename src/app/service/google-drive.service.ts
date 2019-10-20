import { Injectable } from '@angular/core';
import { MultiPartBuilder } from './multipart-builder';
import { Subject, Observable } from 'rxjs';

const API_KEY = 'AIzaSyA-PHzVrdedVDv7s1EwAGcfOq-JFHmldlc';
const CLIENT_ID = '98237286064-bf0vbgpqqklhj434vifvfafvtckaja12.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive.file';

const TUNE_FOLDER = 'Tune Browser';

export interface FileReference {
    id: string;
    name: string;
}

@Injectable()
export class GoogleDriveService {

    private googleAuth: gapi.auth2.GoogleAuth;

    private authenticationStatusSource = new Subject<boolean>();

    authenticationStatus: Observable<boolean> = this.authenticationStatusSource.asObservable();


    initialize(): Promise<void> {
        return new Promise((resolve, reject) => {
            gapi.load('client:auth2', async () => {
                await this.initClient();
                resolve();
            });
        });
    }

    private async initClient() {
        await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        });

        await gapi.client.load('drive', 'v3');

        this.googleAuth = gapi.auth2.getAuthInstance();
        const user = this.googleAuth.currentUser.get();
        console.info('Google API client initialized');

        if (user.getId() === null) {
            this.authenticationStatusSource.next(false);
        } else {
            console.info("user id = " + user.getId());
            console.info("isSignedIn = " + this.googleAuth.isSignedIn.get());
            this.authenticationStatusSource.next(true);
        }
    }

    async signIn() {
        await this.googleAuth.signIn();
        this.authenticationStatusSource.next(true);
    }

    signOut() {
        this.googleAuth.signOut();
        this.authenticationStatusSource.next(false);
    }

    isSignedIn(): boolean {
        return this.googleAuth && this.googleAuth.currentUser.get() != null;
    }

    isSignedOut(): boolean {
        return this.googleAuth && !this.googleAuth.isSignedIn.get();
    }

    async createTextFile(fileName: string, content: string): Promise<string> {
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

            const response = await gapi.client.request<gapi.client.drive.File>({
                path: '/upload/drive/v3/files',
                method: 'POST',
                params: {
                    uploadType: 'multipart'
                },
                headers: { 'Content-Type': multipart.type },
                body: multipart.body
            });
            console.log(`Created file with id = ${response.result.id}`);
            return response.result.id;
        }
        catch (error) {
            console.error('Error creating file', error);
            return null;
        }
    }

    async updateTextFile(fileId: string, content: string): Promise<string> {
        try {
            const response = await gapi.client.request<gapi.client.drive.File>({
                path: '/upload/drive/v3/files/' + fileId,
                method: 'PATCH',
                params: {
                    uploadType: 'media'
                },
                headers: { 'Content-Type': 'text/plain' },
                body: content
            });
            console.log(`Updated file with id = ${response.result.id}`);
            return response.result.id;
        }
        catch (error) {
            console.error('Error updating file', error);
            return null;
        }
    }

    async getTextFile(fileId: string): Promise<string> {
        const response = await gapi.client.drive.files.get({
            fileId: fileId,
            alt: 'media'
        });
        return response.body;
    }

    async listTextFiles(folderId: string): Promise<FileReference[]> {
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
        console.info(`Created folder ${folderName} with id = ${response.result.id}`);
        return response.result.id;
    }

    async findOrCreateFolder(folderName: string): Promise<string> {
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