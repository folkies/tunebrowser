import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

export interface ICaret {
    textPos: number,
    event: any;
}

@Directive({
    selector: '[caretTracker]'
})
export class CaretTrackerDirective implements AfterViewInit {
    private $element: HTMLElement;
    @Output() caret = new EventEmitter<ICaret>();

    constructor(private element: ElementRef) { }

    ngAfterViewInit() {
        this.$element = this.element.nativeElement;
        if (!(this._contentEditable() || this._isTextarea())) {
            throw new Error(`caretTracker directive can be used either on textarea or contenteditable element only`);
        }
    }

    private _contentEditable(): boolean {
        return this.$element.isContentEditable
            && this.$element.getAttribute('contenteditable') === 'true';
    }

    @HostListener('focus', ['$event'])
    onFocus($event: MouseEvent | KeyboardEvent) {
        this.caret.emit({
            textPos: this.getTextPos(),
            event: $event
        });
    }

    @HostListener('keyup', ['$event'])
    onKeyup($event: KeyboardEvent) {
        this.caret.emit({
            textPos: this.getTextPos(),
            event: $event
        });
    }

    @HostListener('mouseup', ['$event'])
    onMouseup($event: MouseEvent) {
        this.caret.emit({
            textPos: this.getTextPos(),
            event: $event
        });
    }

    getTextPos(): number {
        if (this._isTextarea()) {
            return (<HTMLTextAreaElement>this.$element).selectionStart;
        } else {
            return -1;
        }
    }

    private _isTextarea(ele?: HTMLElement): boolean {
        const element = ele || this.$element;
        return element.tagName === 'TEXTAREA' && element instanceof HTMLTextAreaElement;
    }
}
