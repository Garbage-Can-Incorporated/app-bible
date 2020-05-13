import { Directive, Input, OnInit, OnChanges, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[app-alarm-item-control]'
})
export class AlarmItemControlDirective implements OnInit, OnChanges {
  @Input() slider: any;
  constructor(
    private el: ElementRef
   ) { }

  ngOnInit() { }

  ngOnChanges() {
    this.controlTimeColor();
  }

  private controlTimeColor(): void {
    const nextSibling = this.el.nativeElement;

    if (this.slider.checked) {
      if (nextSibling.classList.contains('__app-alarm--value__color--grey')) {
        nextSibling.classList.replace('__app-alarm--value__color--grey', '__app-alarm--value__color--blue');
      } else {
        nextSibling.classList.add('__app-alarm--value__color--blue');
      }
    }

    if (this.slider.checked === false) {
      if (nextSibling.classList.contains('__app-alarm--value__color--blue')) {
        nextSibling.classList.replace('__app-alarm--value__color--blue', '__app-alarm--value__color--grey');
      } else {
        nextSibling.classList.add('__app-alarm--value__color--blue');
      }
    }
  }
}
