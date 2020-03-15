import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const printDirectives = `
%%header "$P0		$P1"
%%titleformat "T, R-1 C1"
%%pagewidth      21cm
%%pageheight     29.7cm
%%topmargin      1.5cm
%%botmargin      1.5cm
%%leftmargin     1.5cm
%%rightmargin    1.5cm
%%topspace       0cm
`;


@Injectable()
export class PdfService {

    constructor(private httpClient: HttpClient) {
    }

    saveAsPdf(abc: string): void {
        this.httpClient.post('https://abc2pdf-vkhoermztq-ew.a.run.app/print', printDirectives + abc, { responseType: 'arraybuffer' })
            .subscribe(response => this.downloadFile(response, 'application/pdf'));
    }

    private downloadFile(data: ArrayBuffer, type: string) {
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob([data], { type }));
        downloadLink.target = 'pdf';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.parentNode.removeChild(downloadLink);
    }
}