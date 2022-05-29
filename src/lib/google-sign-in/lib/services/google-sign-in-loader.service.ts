import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

const GSI_URL = 'https://accounts.google.com/gsi/client';

@Injectable()
export class GoogleSignInLoaderService {

    private gsiLoadedSource = new ReplaySubject<boolean>(1);

    constructor() {
        let node = document.createElement('script');
        node.src = GSI_URL;
        node.type = 'text/javascript';
        node.onload = () => {
            this.gsiLoadedSource.next(true);
            this.gsiLoadedSource.complete();
        };
        document.getElementsByTagName('head')[0].appendChild(node);
    }

    public onLoad(): Observable<boolean> {
        return this.gsiLoadedSource;
    }
}
