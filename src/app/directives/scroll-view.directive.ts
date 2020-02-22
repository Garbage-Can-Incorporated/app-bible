import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[appScrollView]'
})
export class ScrollViewDirective implements OnChanges {
  @Input() status = <boolean>false;
  @Input() exception = <boolean>false;

  constructor(
    private el: ElementRef
  ) { }

  ngOnChanges(): void {
    if (
      this.status !== undefined &&
      this.status !== false &&
      this.exception !== false
    ) {
      this.el.nativeElement.scrollIntoView({
        behavior: 'smooth', block: 'center', inline: 'center'
      });
    }
  }
}
