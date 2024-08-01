import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

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
