import { Component, inject } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Repertoire } from 'src/app/model/repertoire';

@Component({
    selector: 'app-new-repertoire',
    templateUrl: './new-repertoire.component.html',
    standalone: false
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
