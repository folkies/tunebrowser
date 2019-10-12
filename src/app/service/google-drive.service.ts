import { Injectable } from '@angular/core';
import { MultiPartBuilder } from './multipart-builder';

const API_KEY = 'AIzaSyA-PHzVrdedVDv7s1EwAGcfOq-JFHmldlc';
const CLIENT_ID = '98237286064-bf0vbgpqqklhj434vifvfafvtckaja12.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/drive.appfolder https://www.googleapis.com/auth/drive.file';


@Injectable()
export class GoogleDriveService {

    private googleAuth: gapi.auth2.GoogleAuth;

    constructor() {
        gapi.load('client:auth2', () => this.initClient());

    }

    initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(() => {
            this.googleAuth = gapi.auth2.getAuthInstance();
        }).catch((error) => console.log(error));
    }

    signIn() {
        this.googleAuth.signIn();
    }

    signOut() {
        this.googleAuth.signOut();
    }

    async saveTextFile(fileName: string, content: string) {
        const folderId = await this.findOrCreateFolder('My Tunes');

        const resource =  {
            name: fileName,
            mimeType: 'text/plain', 
        };

        const multipart = new MultiPartBuilder()
            .append('application/json', JSON.stringify(resource))
            .append('text/plain', content)
            .finish();

        // const response = await gapi.client.request<gapi.client.drive.File>({
        //     path: '/upload/drive/v3/files',
        //     method: 'POST',
        //     params: {
        //       uploadType: 'multipart'
        //     },
        //     headers: { 'Content-Type' : multipart.type },
        //     body: multipart.body
        //   });
        // console.log(`Created file with id = ${response.result.id}`);            
    }

    async createFolder(folderName: string): Promise<string> {
        const response = await gapi.client.drive.files.create({
            resource: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder'
            }
        });
        return response.result.id;
    }

    async findOrCreateFolder(folderName: string): Promise<string> {
        const response = await gapi.client.drive.files.list({
            q: 'name = "My Tunes"'
        });
        const files = response.result.files;
        if (files.length === 1) {
            return files[0].id;
        }
        return this.createFolder('My Tunes');
    }

}