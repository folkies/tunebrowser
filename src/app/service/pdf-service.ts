import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PdfService {

    constructor(private httpClient: HttpClient) {
    }

    saveAsPdf(abc: string): void {
        this.httpClient.post('https://abc2pdf-vkhoermztq-ew.a.run.app/print', abc, { responseType: 'arraybuffer' })
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