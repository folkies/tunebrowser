import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { RepertoireRepository } from 'src/app/service/repertoire-repository';
import { RepertoireCollection, Repertoire } from 'src/app/model/repertoire';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete, MatOption } from '@angular/material/autocomplete';
import { MatDatepickerInput, MatDatepicker, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';

export interface RepertoireSelection {
    name: string;
    added: Date;
}

@Component({
    selector: 'app-add-to-repertoire',
    templateUrl: './add-to-repertoire.component.html',
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatFormField, MatLabel, MatInput, FormsModule, MatAutocompleteTrigger, ReactiveFormsModule, MatAutocomplete, MatOption, MatDatepickerInput, MatDatepicker, MatDatepickerToggle, MatSuffix, MatDialogActions, MatButton, MatDialogClose]
})
export class AddToRepertoireComponent implements OnInit {
    private dialogRef = inject<MatDialogRef<AddToRepertoireComponent>>(MatDialogRef);
    private repertoireRepository = inject(RepertoireRepository);


    added: UntypedFormControl = new UntypedFormControl(new Date());

    repertoire: UntypedFormControl = new UntypedFormControl();

    private repertoireCollection: RepertoireCollection;

    async ngOnInit() {
        this.repertoireCollection = await this.repertoireRepository.load();        
    }    

    onNoClick(): void {
        this.dialogRef.close(undefined);
    }

    repertoires(): Repertoire[] {
        if (this.repertoireCollection === undefined) {
            return [];
        }
        return this.repertoireCollection.repertoires;
    }

    repertoireName(rep: Repertoire): string {
        return rep.name;
    }

    selection(): RepertoireSelection {
        return {
            name: this.repertoire.value,
            added: this.added.value
        };
    }
}
