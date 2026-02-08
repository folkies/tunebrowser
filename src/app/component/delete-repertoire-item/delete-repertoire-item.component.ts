import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-delete-repertoire-item',
    templateUrl: './delete-repertoire-item.component.html',
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, MatButton]
})
export class DeleteRepertoireItemComponent {
    dialogRef = inject<MatDialogRef<DeleteRepertoireItemComponent>>(MatDialogRef);
    data = inject(MAT_DIALOG_DATA);


    onConfirm(confirm: boolean): void {
        this.dialogRef.close(confirm);
    }
}
