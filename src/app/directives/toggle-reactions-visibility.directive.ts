import { Directive, DoCheck, Input, ElementRef, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appToggleReactionsVisibility]'
})
export class ToggleReactionsVisibilityDirective implements DoCheck {
  @Input() toggleVisibility: boolean = <boolean>false;

  constructor(
    private el: ElementRef
  ) { }

  ngDoCheck() {
    const el = this.el.nativeElement;
    this.toggle(el);
  }

  private toggle(el: any): any {
    if (this.toggleVisibility === false) {
      el.classList.add('d-none');
    }

    if (this.toggleVisibility === true) {
      el.classList.remove('d-none');
    }
  }
}
