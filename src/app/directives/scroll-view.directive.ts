import { Directive, ElementRef, Input, OnChanges, ChangeDetectorRef } from '@angular/core';

@Directive({
  selector: '[appScrollView]'
})
export class ScrollViewDirective implements OnChanges {
  private last: number;
  @Input() status = <boolean> false;
  @Input() lastScrolled: number;
  @Input() exception = <boolean>false;

  constructor(
    private el: ElementRef,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnChanges(): void {
    this.detectChange();
    this.getLastScrolled();

    if (this.last && this.last > this.lastScrolled) {
      this.exception = true;
    }

    if (
      this.status !== undefined &&
      this.status !== false &&
      this.exception !== false
    ) {
      this.el.nativeElement.scrollIntoView({
        behavior: 'smooth', block: 'center', inline: 'center'
      });
    }

    this.setLastScrolled(this.lastScrolled.toString());
  }

  private getLastScrolled(): void {
    this.last = parseInt(window.localStorage.getItem('ls'), 10);
  }

  private setLastScrolled(i: string): void {
    window.localStorage.setItem('ls', i);
  }

  public detectChange(): void {
    this.changeDetector.detach();
    this.changeDetector.reattach();
    this.changeDetector.detectChanges();
  }
}
