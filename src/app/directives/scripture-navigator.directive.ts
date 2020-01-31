import {
  Directive,
  Input,
  Output,
  ElementRef,
  SimpleChanges,
  OnChanges,
  EventEmitter,
  HostListener
} from '@angular/core';
import { IScriptures } from '../interfaces/i-scriptures';

@Directive({
  selector: '[appScriptureNavigator]'
})
export class ScriptureNavigatorDirective implements OnChanges {
  @Input() public resource: IScriptures;
  @Input() public watch: Array<number>;
  @Input() public direction: number;
  @Output() public watchOutput: EventEmitter<object> = new EventEmitter();

  constructor(private el: ElementRef) {}

  ngOnChanges(change: SimpleChanges): void {
    console.log({ w: this.watch, r: this.resource });

    if (this.resource !== undefined &&
      <number> this.resource.chapter === 1) {

      this.toggleLeftEl(this.el.nativeElement);
      this.toggleRightEl(this.el.nativeElement, false);

    } else if (
             this.resource !== undefined &&
             <number>this.resource.chapter > 1
           ) {

             this.toggleLeftEl(this.el.nativeElement, false);
             this.toggleRightEl(this.el.nativeElement, false);

           }

    if (
      this.resource !== undefined &&
      <number>this.resource.chapter === this.watch.length
    ) {

      this.toggleRightEl(this.el.nativeElement);
      this.toggleLeftEl(this.el.nativeElement, false);

      } else if (
               this.resource !== undefined &&
               <number>this.resource.chapter < this.watch.length
             ) {
                this.toggleRightEl(this.el.nativeElement, false);
             }
  }
  @HostListener('click', ['$event']) onClick(e: Event): void {
    console.log({ e });
  }

  private toggleLeftEl(el: Element, rem: boolean = true): void {
    if (el.classList.contains('fa-angle-left')) {
      rem ? el.classList.add('d-none') : el.classList.remove('d-none');
    }
  }

  private toggleRightEl(el: Element, rem: boolean = true): void {
    if (el.classList.contains('fa-angle-right')) {
      rem ? el.classList.add('d-none') : el.classList.remove('d-none');
    }
  }
}
