import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-add-to-repertoire',
    templateUrl: './add-to-repertoire.component.html'
})
export class AddToRepertoireComponent {

    added: FormControl = new FormControl(new Date());

    constructor(
        public dialogRef: MatDialogRef<AddToRepertoireComponent>) {
        }

    onNoClick(): void {
        this.dialogRef.close(undefined);
    }
}
