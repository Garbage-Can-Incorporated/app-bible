import { Directive, Input, DoCheck, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appActionScroll]'
})
export class ActionScrollDirective implements DoCheck, OnInit {
  @Input() reveal: string;
  @Input() _class: string;

  private pos: number;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.pos = this.getCurrentPos();
  }

  ngDoCheck(): void {
    if (
      this.reveal !== undefined &&
      this._class !== undefined
    ) {
      this.toggleClassList(this.el.nativeElement);
    }
  }

  private toggleClassList (icon: Element): void {
    if (this.getCurrentPos() < this.pos) {
      icon.classList.remove(this._class);
    } else {
      icon.classList.add(this._class);
    }
  }

  private getCurrentPos(): number {
    return this.el.nativeElement.getBoundingClientRect().top;
  }
}
