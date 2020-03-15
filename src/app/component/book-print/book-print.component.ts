import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfService } from 'src/app/service/pdf-service';
import { TuneBookIndex } from 'src/app/service/tunebook-index';

@Component({
    selector: 'app-book-print',
    templateUrl: './book-print.component.html'
})
export class BookPrintComponent {

    bookId: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private index: TuneBookIndex,
        private pdfService: PdfService) {

            this.index.tuneBookReady.subscribe(event => this.onReady(event));
            this.route.paramMap.subscribe(paramMap => {
                this.bookId = paramMap.get('id');
                this.onReady(this.bookId);
            });
    
    }

    private onReady(bookId: string) {
        const abc = this.index.findAllTunesInBook(bookId).map(entry => entry.abc).join('\n');
        const bookName = this.index.getBookById(bookId).descriptor.name;
        this.pdfService.saveAsPdf(`%%footer ${bookName}\n${abc}`);
        this.router.navigate(['/books']);
    }
}