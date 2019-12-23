import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add-to-repertoire',
    templateUrl: './add-to-repertoire.component.html'
})
export class AddToRepertoireComponent {

    added: string = new Date().toDateString();

    constructor(
        public dialogRef: MatDialogRef<AddToRepertoireComponent>) { }

    onNoClick(): void {
        this.dialogRef.close(undefined);
    }

    result(): Date {
        return new Date(this.added);
    }
}