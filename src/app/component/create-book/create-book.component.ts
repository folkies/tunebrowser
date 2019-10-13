import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GoogleDriveService } from 'src/app/service/google-drive.service';

@Component({
    selector: 'app-create-book',
    templateUrl: './create-book.component.html'
})
export class CreateBookComponent {
    title: string;
    description: string;
    id: string;

    constructor(private snackBar: MatSnackBar, private googleDrive: GoogleDriveService) {
    }

    async createBook(): Promise<void> {
        const fileName = `${this.id}.abc`;
        await this.googleDrive.saveTextFile(fileName, '');
        this.snackBar.open(`Created ${fileName} on Google Drive`, 'Dismiss', { duration: 3000 });
    }
}
