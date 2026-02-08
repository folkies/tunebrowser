import { Component, inject } from '@angular/core';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Repertoire } from 'src/app/model/repertoire';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-new-repertoire',
    templateUrl: './new-repertoire.component.html',
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatInput, FormsModule, ReactiveFormsModule, MatDialogActions, MatButton, MatDialogClose]
})
export class NewRepertoireComponent {
    dialogRef = inject<MatDialogRef<NewRepertoireComponent>>(MatDialogRef);


    instrument: UntypedFormControl = new UntypedFormControl();
    maxAge: UntypedFormControl = new UntypedFormControl(30);
    numTunesPerAssignment: UntypedFormControl = new UntypedFormControl(10);

    onNoClick(): void {
        this.dialogRef.close(undefined);
    }

    repertoire(): Repertoire {
        return { 
            name: this.instrument.value, 
            maxAge: this.maxAge.value, 
            numTunesPerAssignment: this.numTunesPerAssignment.value, 
            items: []
        };
    }
}
