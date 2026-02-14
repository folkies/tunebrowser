import { Component } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-create-set-dialog',
    templateUrl: './create-set-dialog.component.html',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatFormField,
        MatLabel,
        MatInput,
        FormsModule,
        MatDialogActions,
        MatButton
    ]
})
export class CreateSetDialogComponent {
    setName = '';

    constructor(public dialogRef: MatDialogRef<CreateSetDialogComponent>) {}

    onCancel(): void {
        this.dialogRef.close();
    }

    onCreate(): void {
        if (this.setName.trim()) {
            this.dialogRef.close(this.setName.trim());
        }
    }
}
