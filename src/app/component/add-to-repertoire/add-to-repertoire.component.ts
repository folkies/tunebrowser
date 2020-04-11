import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RepertoireRepository } from 'src/app/service/repertoire-repository';
import { RepertoireCollection, Repertoire } from 'src/app/model/repertoire';

export interface RepertoireSelection {
    name: string;
    added: Date;
}

@Component({
    selector: 'app-add-to-repertoire',
    templateUrl: './add-to-repertoire.component.html'
})
export class AddToRepertoireComponent implements OnInit {

    added: FormControl = new FormControl(new Date());

    repertoire: FormControl = new FormControl();

    private repertoireCollection: RepertoireCollection;

    constructor(
        private dialogRef: MatDialogRef<AddToRepertoireComponent>,
        private repertoireRepository: RepertoireRepository) {
    }

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
