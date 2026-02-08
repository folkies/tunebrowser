import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * Event emitted when the caret position changes in a text area or text input field.
 */
export interface ICaret {
    /** Position of caret in the text. */
    textPos: number,

    /** Mouse or keyboard event that triggered the change. */
    event: MouseEvent | KeyboardEvent;
}

/**
 * Directive that can be added to text areas or text input fields to track the caret position
 * via the `caret` output property.
 */
@Directive({
    selector: '[appCaretTracker]',
    standalone: false
})
export class CaretTrackerDirective implements AfterViewInit {
    private $element: HTMLElement;

    /**
     * Emitted when the caret position is updated after a mouse or keyboard event.
     */
    @Output() caret = new EventEmitter<ICaret>();

    constructor(private element: ElementRef) {
    }

    ngAfterViewInit() {
        this.$element = this.element.nativeElement;
        if (!(this.contentEditable() || this.isTextarea())) {
            throw new Error(`appCaretTracker directive can be used either on textarea or contenteditable element only`);
        }
    }

    private contentEditable(): boolean {
        return this.$element.isContentEditable
            && this.$element.getAttribute('contenteditable') === 'true';
    }

    @HostListener('focus', ['$event'])
    onFocus($event: MouseEvent | KeyboardEvent) {
        this.emitEvent($event);
    }

    @HostListener('keyup', ['$event'])
    onKeyup($event: KeyboardEvent) {
        this.emitEvent($event);
    }

    @HostListener('mouseup', ['$event'])
    onMouseup($event: MouseEvent) {
        this.onFocus($event);
    }

    private emitEvent($event: MouseEvent | KeyboardEvent) {
        this.caret.emit({
            textPos: this.getTextPos(),
            event: $event
        });
    }

    private getTextPos(): number {
        if (this.isTextarea()) {
            return (<HTMLTextAreaElement>this.$element).selectionStart;
        } else {
            return -1;
        }
    }

    private isTextarea(elem?: HTMLElement): boolean {
        const element = elem || this.$element;
        return element.tagName === 'TEXTAREA' && element instanceof HTMLTextAreaElement;
    }
}
