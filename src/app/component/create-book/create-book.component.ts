import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoogleDriveService } from 'src/app/service/google-drive.service';
import { TuneBookCollectionService } from 'src/app/service/tunebook-collection.service';
import { TuneBookDescriptor } from 'src/app/model/tunebook-collection';

@Component({
    selector: 'app-create-book',
    templateUrl: './create-book.component.html',
    standalone: false
})
export class CreateBookComponent {
    title: string;
    description: string;
    id: string;

    constructor(
        private snackBar: MatSnackBar, 
        private googleDrive: GoogleDriveService, 
        private tuneBookCollectionService: TuneBookCollectionService) {
    }

    async createBook(): Promise<void> {
        const fileName = `${this.id}.abc`;
        const fileId = await this.googleDrive.createTextFile(fileName, '');
        const descriptor: TuneBookDescriptor = {
            description: this.description,
            id: this.id,
            name: this.title,
            storage: 'googledrive',
            uri: fileId
        };
        await this.tuneBookCollectionService.addBook(descriptor);
        this.snackBar.open(`Created ${fileName} on Google Drive`, 'Dismiss', { duration: 3000 });
    }
}
