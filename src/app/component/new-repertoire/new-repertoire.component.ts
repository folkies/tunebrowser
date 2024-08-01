import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Repertoire } from 'src/app/model/repertoire';

@Component({
    selector: 'app-new-repertoire',
    templateUrl: './new-repertoire.component.html'
})
export class NewRepertoireComponent {

    instrument: UntypedFormControl = new UntypedFormControl();
    maxAge: UntypedFormControl = new UntypedFormControl(30);
    numTunesPerAssignment: UntypedFormControl = new UntypedFormControl(10);

    constructor(public dialogRef: MatDialogRef<NewRepertoireComponent>) {
    }

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
