import { Injectable } from '@angular/core';
import { MultiPartBuilder } from './multipart-builder';
import { Subject, Observable } from 'rxjs';

const API_KEY = 'AIzaSyA-PHzVrdedVDv7s1EwAGcfOq-JFHmldlc';
const CLIENT_ID = '98237286064-bf0vbgpqqklhj434vifvfafvtckaja12.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive.file';

const TUNE_FOLDER = 'Tune Browser';

@Injectable()
export class GoogleDriveService {

    private googleAuth: gapi.auth2.GoogleAuth;

    private authenticationStatusSource = new Subject<boolean>();

    authenticationStatus: Observable<boolean> = this.authenticationStatusSource.asObservable();


    constructor() {
        this.authenticationStatusSource.next(true);
        gapi.load('client:auth2', () => this.initClient());

    }

    private initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(() => {
            this.googleAuth = gapi.auth2.getAuthInstance();
            const user = this.googleAuth.currentUser.get();
            console.info('Google API client initialized');
            if (user.getId() === null) {
                this.authenticationStatusSource.next(false);
            } else {
                console.info("user id = " + user.getId());
                this.authenticationStatusSource.next(true);
            }
        }).catch((error) => console.log(error));
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
        return this.googleAuth && ! this.googleAuth.isSignedIn.get();
    }

    async saveTextFile(fileName: string, content: string): Promise<string> {
        try {
            const folderId = await this.findOrCreateFolder('My Tunes');

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
            console.error('Error saving file', error);
            return null;
        }
    }

    async createFolder(folderName: string): Promise<string> {
        const response = await gapi.client.drive.files.create({
            resource: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder'
            }
        });
        console.info('Created "My Tunes" folder with id = ' + response.result.id);
        return response.result.id;
    }

    async findOrCreateFolder(folderName: string): Promise<string> {
        const response = await gapi.client.drive.files.list({
            q: `name = "${TUNE_FOLDER}"`
        });
        const files = response.result.files;
        if (files.length === 1) {
            return files[0].id;
        }
        return this.createFolder(TUNE_FOLDER);
    }

}