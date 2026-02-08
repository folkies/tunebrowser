import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-delete-repertoire-item',
    templateUrl: './delete-repertoire-item.component.html',
    standalone: false
})
export class DeleteRepertoireItemComponent {
    dialogRef = inject<MatDialogRef<DeleteRepertoireItemComponent>>(MatDialogRef);
    data = inject(MAT_DIALOG_DATA);


    onConfirm(confirm: boolean): void {
        this.dialogRef.close(confirm);
    }
}
