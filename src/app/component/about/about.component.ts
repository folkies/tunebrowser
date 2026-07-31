import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Displays some information about Tune Browser.
 */
@Component({
    selector: 'app-about',
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './about.component.html'
})
export class AboutComponent {
}