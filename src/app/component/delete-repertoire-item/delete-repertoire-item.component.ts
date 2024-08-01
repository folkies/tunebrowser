import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'delete-repertoire-item',
    templateUrl: './delete-repertoire-item.component.html'
})
export class DeleteRepertoireItemComponent {


    constructor(public dialogRef: MatDialogRef<DeleteRepertoireItemComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string) {
    }

    onConfirm(confirm: boolean): void {
        this.dialogRef.close(confirm);
    }
}
