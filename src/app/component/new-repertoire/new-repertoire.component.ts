import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Repertoire } from 'src/app/model/repertoire';

@Component({
    selector: 'app-new-repertoire',
    templateUrl: './new-repertoire.component.html'
})
export class NewRepertoireComponent {

    instrument: FormControl = new FormControl();
    maxAge: FormControl = new FormControl(30);
    numTunesPerAssignment: FormControl = new FormControl(10);

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
