import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RepertoireRepository } from 'src/app/service/repertoire-repository';

@Component({
    selector: 'practice',
    templateUrl: './practice.component.html'
})
export class PracticeComponent {

    constructor(
        private snackBar: MatSnackBar, 
        private repertoireRepository: RepertoireRepository) {
    }

}
